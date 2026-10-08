// src/features/mitra/data-request/hooks/use-bidang-aoi-features.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { runFilterBidangAoiInWorker } from "@/features/mitra/data-request/services/geo-ops-worker.service";
import type {
  BidangAoiLayerItem,
  UseBidangAoiFeaturesParams,
  UseBidangAoiFeaturesResult,
} from "@/features/mitra/data-request/types/mitra.data-request.bidang.type";
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { useMemo } from "react";

export const useBidangAoiFeatures = (
  params: UseBidangAoiFeaturesParams,
): UseBidangAoiFeaturesResult => {
  // Props
  const {
    aoiPolygon: rawAoi,
    bidangLayers: explicitBidangLayers,
    enabled = true,
  } = params;

  // Derived Values
  const aoiFeature = useMemo(() => normalizePolygonFeature(rawAoi), [rawAoi]);

  const aoiWkt = useMemo(() => {
    if (!aoiFeature) return "";
    return geojsonPolygonToWkt(aoiFeature);
  }, [aoiFeature]);

  const aoiCqlFilter = useMemo(() => {
    if (!aoiWkt) return "";
    return `INTERSECTS(the_geom, ${aoiWkt})`;
  }, [aoiWkt]);

  const isEnabled = Boolean(enabled && aoiFeature && aoiCqlFilter);

  const layerKey = useMemo(() => {
    if (explicitBidangLayers && explicitBidangLayers.length > 0) {
      return explicitBidangLayers
        .map((l) => l.id)
        .sort()
        .join(",");
    }
    return "all";
  }, [explicitBidangLayers]);

  const queryKey = queryKeys.mitra.dataRequest.bidangFeatures(
    `${aoiCqlFilter}|${layerKey}`,
  );

  // Queries
  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey,
    queryFn: async ({ signal }): Promise<GeoJSON.FeatureCollection> => {
      if (!aoiFeature || !aoiCqlFilter) {
        return {
          type: "FeatureCollection",
          features: [],
        };
      }

      let targetLayers: BidangAoiLayerItem[] = explicitBidangLayers ?? [];
      if (isEmptyArray(targetLayers)) {
        const layersResp = await getIgtLayers(signal);
        const resolvedList: BidangAoiLayerItem[] = [];

        for (const l of layersResp.items ?? []) {
          const isBidang = (l.igtBasis ?? l.spatialBasis) === "bidang";
          const typeName = l.typeName || l.wfs?.wfsTypeName || l.id;
          const wfsUrl = l.wfs?.url || l.wfs?.wfsUrl || l.wfs?.baseUrl;

          if (isBidang && typeName) {
            resolvedList.push({
              id: l.id,
              typeName,
              wfsUrl: wfsUrl || undefined,
              title: l.title,
            });
          }
        }
        targetLayers = resolvedList;
      }

      if (isEmptyArray(targetLayers)) {
        return {
          type: "FeatureCollection",
          features: [],
        };
      }

      // Fetch WFS in parallel for all target bidang layers with spatial CQL filter
      const fetchPromises = targetLayers.map(async (layer) => {
        try {
          const wfsResult = await fetchWfs({
            typeName: layer.typeName,
            wfsUrl: layer.wfsUrl,
            cqlFilter: aoiCqlFilter,
            version: "1.0.0",
            srsName: "EPSG:4326",
            signal,
          });

          if (!wfsResult || !wfsResult.features) {
            return [];
          }

          // Inject source layer info into feature properties for identification
          return wfsResult.features.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              __sourceLayerId: layer.id,
              __sourceLayerTitle: layer.title ?? layer.typeName,
            },
          }));
        } catch (err: unknown) {
          if ((err as { name?: string }).name === "AbortError") {
            return [];
          }
          console.warn(
            `Failed to fetch WFS features for layer ${layer.typeName}:`,
            err,
          );
          return [];
        }
      });

      const featureArrays = await Promise.all(fetchPromises);
      const combinedFeatures: GeoJSON.Feature[] = featureArrays.flat();

      // Strict spatial intersection filter executed in Web Worker with exact unsimplified AOI
      const intersectedFeatures = await runFilterBidangAoiInWorker(
        combinedFeatures,
        aoiFeature,
        signal,
      );

      return {
        type: "FeatureCollection",
        features: intersectedFeatures,
      };
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes client cache
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    features: data ?? null,
    totalFeatures: data?.features?.length ?? 0,
    isLoading: isEnabled && (isLoading || isFetching),
    isError,
    error: error as Error | null,
  };
};
