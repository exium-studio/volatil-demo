// src/features/mitra/data-request/api/mitra.data-request-wfs-summary.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { IGT_AREA_KEYS } from "@/features/mitra/data-request/constants/igt.config";
import { adaptCqlFilterToLayerAttributes } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import {
  calculateIntersectAreaInHectares,
  extractAoiPolygonsFromCql,
} from "@/features/mitra/data-request/utils/calculate-feature-area";
import { getWfsDynamicAttributes } from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";

export type LayerCountSummary = {
  spatialBasis: "bidang" | "kawasan";
  totalCount: number;
  totalAreaHa: number;
  label: string;
};

/**
 * Fetches hit count / geometry area summary for an IGT layer based on its spatialBasis.
 * - If spatialBasis === 'bidang': gets total feature count via WFS hits query.
 * - If spatialBasis === 'kawasan': fetches features and calculates total area in hectares (ha).
 */
export const getLayerCountSummary = async (params: {
  typeName: string;
  wfsUrl: string;
  spatialBasis: "bidang" | "kawasan";
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<LayerCountSummary> => {
  const { typeName, wfsUrl, spatialBasis, cqlFilter, signal } = params;

  if (!typeName || !wfsUrl) {
    return {
      spatialBasis,
      totalCount: 0,
      totalAreaHa: 0,
      label: "-",
    };
  }

  try {
    let mergedCqlFilter = cqlFilter;
    if (cqlFilter) {
      const dynamicAttrs = await getWfsDynamicAttributes(
        typeName,
        wfsUrl,
        signal,
      );
      if (dynamicAttrs.length > 0) {
        mergedCqlFilter = adaptCqlFilterToLayerAttributes(
          cqlFilter,
          dynamicAttrs,
        );
      }
    }

    if (spatialBasis === "bidang") {
      try {
        const hitsResult = await fetchWfs({
          typeName,
          wfsUrl,
          version: "2.0.0",
          resultType: "hits",
          cqlFilter: mergedCqlFilter,
          signal,
        });

        const totalCount = hitsResult.totalFeatures ?? 0;
        if (totalCount > 0) {
          return {
            spatialBasis: "bidang",
            totalCount,
            totalAreaHa: 0,
            label: `${totalCount.toLocaleString("id-ID")} bidang`,
          };
        }
      } catch (hitsErr) {
        console.warn(
          `WFS hits query failed for ${typeName}, trying maxFeatures=1:`,
          hitsErr,
        );
      }

      // Fallback query with maxFeatures=1 to retrieve totalFeatures header from GeoServer
      const fallbackResult = await fetchWfs({
        typeName,
        wfsUrl,
        version: "2.0.0",
        maxFeatures: 1,
        cqlFilter: mergedCqlFilter,
        signal,
      });

      const totalCount =
        fallbackResult.totalFeatures ?? fallbackResult.features.length;
      return {
        spatialBasis: "bidang",
        totalCount,
        totalAreaHa: 0,
        label: `${totalCount.toLocaleString("id-ID")} bidang`,
      };
    }

    // For kawasan: fetch features to calculate total hectares (ha)
    const featuresResult = await fetchWfs({
      typeName,
      wfsUrl,
      version: "2.0.0",
      cqlFilter: mergedCqlFilter,
      signal,
    });

    const features = featuresResult.features ?? [];
    const aoiPolygon = extractAoiPolygonsFromCql(mergedCqlFilter);
    let totalAreaHa = 0;

    features.forEach((feat) => {
      if (feat.geometry) {
        const area = calculateIntersectAreaInHectares(feat, aoiPolygon);
        if (area > 0) {
          totalAreaHa += area;
          return;
        }
      }

      const props =
        (feat.properties as Record<string, unknown> | undefined) ?? {};
      const luasKey = Object.keys(props).find((k) =>
        (IGT_AREA_KEYS as readonly string[]).includes(k.toLowerCase()),
      );
      if (luasKey) {
        const val = Number(props[luasKey]);
        if (!isNaN(val)) {
          totalAreaHa += val;
        }
      }
    });

    const formattedArea = totalAreaHa.toLocaleString("id-ID", {
      maximumFractionDigits: 2,
    });

    return {
      spatialBasis: "kawasan",
      totalCount: features.length,
      totalAreaHa,
      label:
        totalAreaHa > 0 ? `${formattedArea} ha` : `${features.length} kawasan`,
    };
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }
    console.warn(`getLayerCountSummary failed for ${typeName}:`, error);
    return {
      spatialBasis,
      totalCount: 0,
      totalAreaHa: 0,
      label: "-",
    };
  }
};
