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
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { useMemo } from "react";

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

  const isEnabled = Boolean(enabled && aoiFeature && aoiCqlFilter);

  // Queries
  const { data, isLoading, isFetching, error, isError, refetch } = useQuery({
    queryKey: queryKeys.mitra.dataRequest.kawasanCoverage(aoiCqlFilter),
    queryFn: async ({ signal }) => {
      if (!aoiFeature || !aoiCqlFilter) {
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

      if (isEmptyArray(targetLayers)) {
        return {
          coveragePolygon: null,
          totalAreaHa: 0,
          totalIntersectedFeatures: 0,
          isEmpty: true,
        };
      }

      // 2. Fetch intersecting features for all active kawasan layers
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
          return res.features ?? [];
        } catch (err) {
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
        return {
          coveragePolygon: null,
          totalAreaHa: 0,
          totalIntersectedFeatures: 0,
          isEmpty: true,
        };
      }

      // 3 & 4. Clip to boundary & Unary union off the main thread via Web Worker
      return runClipAndUnionKawasanInWorker(allKawasanFeatures, aoiFeature, signal);
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    coveragePolygon: data?.coveragePolygon ?? null,
    totalAreaHa: data?.totalAreaHa ?? 0,
    totalIntersectedFeatures: data?.totalIntersectedFeatures ?? 0,
    isLoading: isEnabled && (isLoading || isFetching),
    isError,
    error: error instanceof Error ? error : null,
    refetch: async () => {
      await refetch();
    },
  };
};
