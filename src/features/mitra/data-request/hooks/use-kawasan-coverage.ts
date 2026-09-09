// src/features/mitra/data-request/hooks/use-kawasan-coverage.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import type {
  KawasanCoverageLayerItem,
  UseKawasanCoverageParams,
  UseKawasanCoverageResult,
} from "@/features/mitra/data-request/types/mitra.data-request.coverage.type";
import { runClipAndUnionKawasanInWorker } from "@/features/mitra/data-request/services/geo-ops-worker.service";
import { calculateFeatureAreaInHectares } from "@/features/mitra/data-request/utils/calculate-feature-area";
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { useEffect, useMemo, useState } from "react";

/**
 * Universal hook for Kawasan IGT coverage processing across ALL AOI methods (Draw, Upload, Wilayah Administrasi):
 * 1. Takes AOI polygon (Polygon / MultiPolygon).
 * 2. Fetches all active kawasan IGT layers intersecting the AOI via GeoServer WFS with spatial CQL filter: INTERSECTS(geom, POLYGON((lon lat, ...))).
 * 3. Clips every geometry to the AOI boundary.
 * 4. Runs Turf.js unary union across all clipped geometries into 1 outer coverage boundary.
 * 5. Computes total coverage area in hectares (ha) using turf.area().
 */
export const useKawasanCoverage = (
  params: UseKawasanCoverageParams,
): UseKawasanCoverageResult => {
  const { aoiPolygon: rawAoi, kawasanLayers: explicitKawasanLayers, enabled = true } = params;

  // Derived Values
  const aoiFeature = useMemo(
    () => normalizePolygonFeature(rawAoi),
    [rawAoi],
  );

  const aoiWkt = useMemo(() => {
    if (!aoiFeature) return "";
    return geojsonPolygonToWkt(aoiFeature);
  }, [aoiFeature]);

  const aoiCqlFilter = useMemo(() => {
    if (!aoiWkt) return "";
    return `INTERSECTS(geom, ${aoiWkt})`;
  }, [aoiWkt]);

  // Instantly compute AOI area in Hectares (1 polygon calculation is <1ms)
  const aoiAreaHa = useMemo(() => {
    if (!aoiFeature) return 0;
    return calculateFeatureAreaInHectares(aoiFeature);
  }, [aoiFeature]);

  // States
  const [realProgress, setRealProgress] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(10);
  const [stepMessage, setStepMessage] = useState<string>(
    "Menyiapkan query AOI...",
  );

  const isEnabled = Boolean(enabled && aoiFeature && aoiCqlFilter);

  const queryClient = useQueryClient();

  const queryKey = queryKeys.mitra.dataRequest.kawasanCoverage(aoiCqlFilter);

  // Queries
  const { data, isLoading, isFetching, error, isError, refetch } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setRealProgress(5);
      setStepMessage("Menyiapkan data layer kawasan...");

      if (!aoiFeature || !aoiCqlFilter) {
        setRealProgress(100);
        setStepMessage("Selesai");
        return {
          coveragePolygon: null,
          totalAreaHa: 0,
          totalIntersectedFeatures: 0,
          isEmpty: true,
        };
      }

      let targetLayers: KawasanCoverageLayerItem[] =
        explicitKawasanLayers ?? [];
      if (isEmptyArray(targetLayers)) {
        const layersResp = await getIgtLayers(signal);
        const resolvedList: KawasanCoverageLayerItem[] = [];

        for (const l of layersResp.items ?? []) {
          const typeName = l.wfs?.wfsTypeName;
          const wfsUrl = l.wfs?.wfsUrl;
          if (l.spatialBasis === "kawasan" && typeName && wfsUrl) {
            resolvedList.push({
              id: l.id,
              typeName,
              wfsUrl,
              title: l.title,
            });
          }
        }

        targetLayers = resolvedList;
      }

      setRealProgress(15);
      setStepMessage("Mengunduh data fitur kawasan dari GeoServer...");

      if (isEmptyArray(targetLayers)) {
        setRealProgress(100);
        setStepMessage("Selesai");
        return {
          coveragePolygon: null,
          totalAreaHa: 0,
          totalIntersectedFeatures: 0,
          isEmpty: true,
        };
      }

      // 2. Fetch intersecting features for all active kawasan layers with progress tracking
      let completedFetches = 0;
      const totalLayers = targetLayers.length;

      const fetchPromises = targetLayers.map(async (layer) => {
        try {
          const res = await fetchWfs({
            typeName: layer.typeName,
            wfsUrl: layer.wfsUrl,
            version: "2.0.0",
            srsName: "EPSG:4326",
            cqlFilter: aoiCqlFilter,
            signal,
          });
          completedFetches++;
          // WFS fetch phase maps to 15% - 50%
          const fetchProgress = 15 + Math.round((completedFetches / totalLayers) * 35);
          setRealProgress(fetchProgress);
          setStepMessage(
            `Mengunduh data layer kawasan (${completedFetches}/${totalLayers})...`,
          );
          return res.features ?? [];
        } catch (err) {
          completedFetches++;
          const fetchProgress = 15 + Math.round((completedFetches / totalLayers) * 35);
          setRealProgress(fetchProgress);
          if (
            signal?.aborted ||
            (err instanceof DOMException && err.name === "AbortError") ||
            (err instanceof Error && err.name === "AbortError")
          ) {
            throw err;
          }
          console.warn(`Failed to fetch features for layer ${layer.typeName}:`, err);
          return [] as GeoJSON.Feature[];
        }
      });

      const featureArrays = await Promise.all(fetchPromises);
      const allKawasanFeatures = featureArrays.flat();

      if (isEmptyArray(allKawasanFeatures)) {
        setRealProgress(100);
        setStepMessage("Tidak ditemukan kawasan berpotongan.");
        return {
          coveragePolygon: null,
          totalAreaHa: 0,
          totalIntersectedFeatures: 0,
          isEmpty: true,
        };
      }

      setRealProgress(50);
      setStepMessage(
        `Memotong ${allKawasanFeatures.length} fitur kawasan ke dalam batas AOI (clipping)...`,
      );

      // 3 & 4. Clip to boundary & Unary union off the main thread via Web Worker with progress callback
      const result = await runClipAndUnionKawasanInWorker(
        allKawasanFeatures,
        aoiFeature,
        signal,
        (workerProgress, workerMessage) => {
          setRealProgress(workerProgress);
          if (workerMessage) {
            setStepMessage(workerMessage);
          }
        },
      );

      setRealProgress(100);
      setStepMessage("Kalkulasi cakupan kawasan selesai");
      return result;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const isCalculating = isEnabled && (isLoading || isFetching);

  // Smooth progressive timer based on AOI area:
  // Dynamically ticks up smoothly towards realProgress or asymptotes to 97% until done
  useEffect(() => {
    if (!isCalculating) return;

    // Determine target interval and step rate based on AOI scale
    // Smaller AOI (< 1000 ha) moves faster; large AOI (> 25000 ha) moves more cautiously
    const tickMs = aoiAreaHa > 25000 ? 150 : aoiAreaHa > 5000 ? 100 : 70;

    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        // If query/worker reports a higher real progress, advance toward it
        if (realProgress > prev) {
          const delta = Math.ceil((realProgress - prev) / 3);
          return Math.min(prev + delta, realProgress);
        }

        // Asymptotically creep up to 97% while waiting for heavy union operations
        if (prev < 97) {
          return prev + 1;
        }

        return prev;
      });
    }, tickMs);

    return () => {
      clearInterval(timer);
    };
  }, [isCalculating, realProgress, aoiAreaHa]);

  return {
    coveragePolygon: data?.coveragePolygon ?? null,
    totalAreaHa: data?.totalAreaHa ?? 0,
    totalIntersectedFeatures: data?.totalIntersectedFeatures ?? 0,
    isLoading: isCalculating,
    isError,
    error: error instanceof Error ? error : null,
    progress: isCalculating ? Math.min(displayProgress, 99) : 100,
    stepMessage,
    aoiAreaHa,
    refetch: async () => {
      setRealProgress(0);
      setDisplayProgress(0);
      await refetch();
    },
    cancel: () => {
      setRealProgress(0);
      setDisplayProgress(0);
      void queryClient.cancelQueries({ queryKey });
    },
  };
};
