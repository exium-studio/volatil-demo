import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { IGT_AREA_KEYS } from "@/features/mitra/data-request/constants/igt.config";
import {
  calculateIntersectAreaInHectares,
  extractAoiPolygonsFromCql,
} from "@/features/mitra/data-request/utils/calculate-feature-area";
import type GeoJSON from "geojson";

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
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL &&
      !import.meta.env.VITE_API_BASE_URL.endsWith("/")
        ? `${import.meta.env.VITE_API_BASE_URL}/api/proxy/wfs`
        : `${import.meta.env.VITE_API_BASE_URL || ""}/api/proxy/wfs`;

    const url = new URL(baseUrl);
    url.searchParams.set("layerId", typeName);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "2.0.0");
    url.searchParams.set("request", "DescribeFeatureType");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", "application/json");

    const descRes = await fetch(url.toString(), { signal });
    if (descRes.ok) {
      const schema = await descRes.json();
      const properties: WfsSchemaProperty[] =
        schema.featureTypes?.[0]?.properties ?? [];
      const allKeys = properties.map((prop) => prop.name);
      if (allKeys.length > 0) {
        cachedAttributes[cacheKey] = allKeys;
        return allKeys;
      }
    }
  } catch {
    // Fallback to GetFeature if DescribeFeatureType fails
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

type WfsSchemaProperty = {
  name: string;
  type: string;
  localType?: string;
};

/**
 * Fetches WFS attributes of string type dynamically from GeoServer DescribeFeatureType response.
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
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL &&
      !import.meta.env.VITE_API_BASE_URL.endsWith("/")
        ? `${import.meta.env.VITE_API_BASE_URL}/api/proxy/wfs`
        : `${import.meta.env.VITE_API_BASE_URL || ""}/api/proxy/wfs`;

    const url = new URL(baseUrl);
    url.searchParams.set("layerId", typeName);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "2.0.0");
    url.searchParams.set("request", "DescribeFeatureType");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", "application/json");

    const res = await fetch(url.toString(), {
      signal,
    });

    if (res.ok) {
      const schema = await res.json();
      const properties: WfsSchemaProperty[] =
        schema.featureTypes?.[0]?.properties ?? [];
      const stringKeys = properties
        .filter(
          (prop) => prop.type === "xsd:string" || prop.localType === "string",
        )
        .map((prop) => prop.name);

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

export type FetchWfsCatalogParams = {
  typeName?: string;
  wfsUrl?: string;
  page: number;
  pageSize: number;
  cqlFilter?: string;
  search?: string;
  signal?: AbortSignal;
};

export type FetchWfsCatalogResult = {
  features: GeoJSON.Feature[];
  totalFeatures: number;
  totalLuas: number;
  bidangCount: number;
  kawasanCount: number;
};

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

  const stringAttributes = await getWfsStringAttributes(
    typeName,
    wfsUrl,
    signal,
  );

  // Build search CQL using only double-quoted WFS string attributes and ILIKE
  const trimmedSearch = search?.trim();
  const searchCql =
    trimmedSearch && trimmedSearch.length > 0 && stringAttributes.length > 0
      ? stringAttributes
          .map((attr) => `"${attr}" ILIKE '%${trimmedSearch}%'`)
          .join(" OR ")
      : undefined;

  const mergedCqlFilter =
    [cqlFilter, searchCql ? `(${searchCql})` : undefined]
      .filter(Boolean)
      .join(" AND ") || undefined;

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
          return;
        }
      }

      // Fallback to property key if geometry calculation returned 0
      const luasKey = Object.keys(props).find((k) =>
        (IGT_AREA_KEYS as readonly string[]).includes(k.toLowerCase()),
      );
      if (luasKey) {
        const val = Number(props[luasKey]);
        if (!isNaN(val)) {
          totalLuas += val;
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
    return {
      features: [],
      totalFeatures: 0,
      totalLuas: 0,
      bidangCount: 0,
      kawasanCount: 0,
    };
  }
};
