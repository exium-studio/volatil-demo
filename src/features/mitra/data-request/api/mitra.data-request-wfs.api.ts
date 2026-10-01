// src/features/mitra/data-request/api/mitra.data-request-wfs.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { adaptCqlFilterToLayerAttributes } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import {
  calculateIntersectAreaInHectares,
  extractAoiPolygonsFromCql,
} from "@/features/mitra/data-request/utils/calculate-feature-area";

const cachedAttributes: Record<string, string[]> = {};
const cachedStringAttributes: Record<string, string[]> = {};

/**
 * Dynamically fetches attribute property keys from the first feature of a WFS type.
 * Used for building table headers when schema is unknown upfront.
 */
export const getWfsDynamicAttributes = async (
  typeName?: string,
  wfsUrl?: string,
  signal?: AbortSignal,
): Promise<string[]> => {
  if (!typeName || !wfsUrl) return [];
  const cacheKey = `${wfsUrl}:${typeName}`;
  if (cachedAttributes[cacheKey]) {
    return cachedAttributes[cacheKey];
  }

  try {
    const res = await fetchWfs({
      typeName,
      wfsUrl,
      version: "2.0.0",
      maxFeatures: 1,
      signal,
    });
    const firstFeature = res.features?.[0];
    if (firstFeature?.properties) {
      const keys = Object.keys(firstFeature.properties);
      if (keys.length > 0) {
        cachedAttributes[cacheKey] = keys;
        return keys;
      }
    }
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      return [];
    }
    console.warn("Failed to fetch WFS attributes dynamically:", error);
  }
  return [];
};

/**
 * Fetches WFS attributes of string type dynamically from sample feature.
 * Used to build case-insensitive search queries on text-only fields to prevent SQL type errors.
 */
export const getWfsStringAttributes = async (
  typeName?: string,
  wfsUrl?: string,
  signal?: AbortSignal,
): Promise<string[]> => {
  if (!typeName || !wfsUrl) return [];
  const cacheKey = `${wfsUrl}:${typeName}`;
  if (cachedStringAttributes[cacheKey]) {
    return cachedStringAttributes[cacheKey];
  }

  try {
    const res = await fetchWfs({
      typeName,
      wfsUrl,
      version: "2.0.0",
      maxFeatures: 1,
      signal,
    });
    const firstFeature = res.features?.[0];
    if (firstFeature?.properties) {
      const stringKeys = Object.entries(firstFeature.properties)
        .filter(([, val]) => typeof val === "string")
        .map(([key]) => key);

      if (stringKeys.length > 0) {
        cachedStringAttributes[cacheKey] = stringKeys;
        return stringKeys;
      }
    }
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      return [];
    }
    console.warn("Failed to fetch DescribeFeatureType schema:", error);
  }

  return [];
};

import type {
  FetchWfsCatalogParams,
  FetchWfsCatalogResult,
} from "@/features/mitra/data-request/types/mitra.data-request.wfs.type";

/**
 * Fetches WFS features for catalog display with automatic total count and fallback handling.
 */
export const fetchWfsCatalog = async ({
  typeName,
  wfsUrl,
  page,
  pageSize,
  cqlFilter,
  search,
  signal,
}: FetchWfsCatalogParams): Promise<FetchWfsCatalogResult> => {
  if (!typeName || !wfsUrl) {
    return {
      features: [],
      totalFeatures: 0,
      totalLuas: 0,
      bidangCount: 0,
      kawasanCount: 0,
    };
  }

  const startIndex = (page - 1) * pageSize;

  let searchCql: string | undefined = undefined;
  const trimmedSearch = search?.trim();

  if (trimmedSearch && trimmedSearch.length > 0) {
    const stringAttributes = await getWfsStringAttributes(
      typeName,
      wfsUrl,
      signal,
    );
    if (stringAttributes.length > 0) {
      searchCql = stringAttributes
        .map((attr) => `"${attr}" ILIKE '%${trimmedSearch}%'`)
        .join(" OR ");
    }
  }

  const dynamicAttributes = await getWfsDynamicAttributes(
    typeName,
    wfsUrl,
    signal,
  );

  const rawMergedFilter =
    [cqlFilter, searchCql ? `(${searchCql})` : undefined]
      .filter(Boolean)
      .join(" AND ") || undefined;

  const mergedCqlFilter = adaptCqlFilterToLayerAttributes(
    rawMergedFilter,
    dynamicAttributes,
  );

  try {
    // Fetch current page of actual features using WFS 2.0.0
    const pageResult = await fetchWfs({
      typeName,
      wfsUrl,
      version: "2.0.0",
      maxFeatures: pageSize,
      startIndex,
      cqlFilter: mergedCqlFilter,
      signal,
    });

    const features = pageResult.features ?? [];
    const totalFeatures = pageResult.totalFeatures ?? features.length;

    // Count bidang vs kawasan and total luas from actual feature properties basis & geometry
    let bidangCount = 0;
    let kawasanCount = 0;
    let totalLuas = 0;
    const aoiPolygon = extractAoiPolygonsFromCql(mergedCqlFilter);

    features.forEach((feat) => {
      const props =
        (feat.properties as Record<string, unknown> | undefined) ?? {};
      const basis = props.basis;
      if (basis === "kawasan") {
        kawasanCount += 1;
      } else {
        bidangCount += 1;
      }

      // Calculate area directly from geometry in ha using turf with intersection clipping
      if (feat.geometry) {
        const geomAreaHa = calculateIntersectAreaInHectares(feat, aoiPolygon);
        if (geomAreaHa > 0) {
          totalLuas += geomAreaHa;
        }
      }
    });

    // If basis count sums to 0 (default WFS features), treat all as bidang by default
    if (bidangCount === 0 && kawasanCount === 0) {
      bidangCount = totalFeatures;
    }

    return {
      features,
      totalFeatures,
      totalLuas,
      bidangCount,
      kawasanCount,
    };
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }
    console.error(`fetchWfsCatalog failed:`, error);
    throw error;
  }
};
