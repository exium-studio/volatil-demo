// src/features/mitra/data-request/api/mitra.data-request-wfs.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type GeoJSON from "geojson";

const cachedAttributes: Record<string, string[]> = {};
const cachedStringAttributes: Record<string, string[]> = {};

import { getMapServerEndpoints } from "@/design-system/components/map/services/map-endpoints.api";

async function resolveWfsUrl(providedUrl?: string, signal?: AbortSignal): Promise<string> {
  if (providedUrl) return providedUrl;
  const endpoints = await getMapServerEndpoints(signal);
  return endpoints[0]?.wfsUrl ?? "";
}

/**
 * Fetches all properties keys dynamically from the first feature of a WFS type.
 */
export const getWfsAttributes = async (
  typeName?: string,
  wfsUrl?: string,
  signal?: AbortSignal,
): Promise<string[]> => {
  if (!typeName) return [];
  const targetWfsUrl = await resolveWfsUrl(wfsUrl, signal);
  const cacheKey = `${targetWfsUrl}:${typeName}`;
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
    console.error("Failed to fetch WFS attributes dynamically:", error);
  }
  return [
    "id",
    "kodewilaya",
    "kabupaten",
    "kecamatan",
    "kelurahan",
    "tipehak",
    "nib",
    "luastertul",
    "statbid",
  ];
};

type WfsSchemaProperty = {
  name: string;
  type: string;
  localType?: string;
};

/**
 * Fetches WFS attributes of string type dynamically from GeoServer DescribeFeatureType response.
 * This is used to build case-insensitive search queries on text-only fields to prevent SQL type errors.
 */
export const getWfsStringAttributes = async (
  typeName?: string,
  wfsUrl?: string,
  signal?: AbortSignal,
): Promise<string[]> => {
  if (!typeName) return [];
  const targetWfsUrl = await resolveWfsUrl(wfsUrl, signal);
  const cacheKey = `${targetWfsUrl}:${typeName}`;
  if (cachedStringAttributes[cacheKey]) {
    return cachedStringAttributes[cacheKey];
  }

  try {
    const url = new URL(targetWfsUrl);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "2.0.0");
    url.searchParams.set("request", "DescribeFeatureType");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", "application/json");

    const res = await fetch(url.toString(), { signal });
    if (res.ok) {
      const schema = await res.json();
      const properties: WfsSchemaProperty[] =
        schema.featureTypes?.[0]?.properties ?? [];
      const stringKeys = properties
        .filter(
          (prop) =>
            prop.type === "xsd:string" || prop.localType === "string",
        )
        .map((prop) => prop.name);

      if (stringKeys.length > 0) {
        cachedStringAttributes[cacheKey] = stringKeys;
        return stringKeys;
      }
    }
  } catch (error) {
    console.error("Failed to fetch DescribeFeatureType schema:", error);
  }

  return [
    "id",
    "kodewilaya",
    "kabupaten",
    "kecamatan",
    "kelurahan",
    "tipehak",
    "nib",
    "statbid",
  ];
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
  bidangCount: number;
  kawasanCount: number;
};

/**
 * Fetches a paginated page of IGT features from WFS v2.0.0.
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
  if (!typeName) {
    return {
      features: [],
      totalFeatures: 0,
      bidangCount: 0,
      kawasanCount: 0,
    };
  }

  const targetWfsUrl = await resolveWfsUrl(wfsUrl, signal);
  const startIndex = (page - 1) * pageSize;

  const stringAttributes = await getWfsStringAttributes(
    typeName,
    targetWfsUrl,
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
      wfsUrl: targetWfsUrl,
      version: "2.0.0",
      maxFeatures: pageSize,
      startIndex,
      cqlFilter: mergedCqlFilter,
      signal,
    });

    const total = pageResult.totalFeatures ?? pageResult.features?.length ?? 0;

    return {
      features: pageResult.features ?? [],
      totalFeatures: total,
      bidangCount: total,
      kawasanCount: 0,
    };
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw error;
    }
    console.error("fetchWfsCatalog failed:", error);
    return {
      features: [],
      totalFeatures: 0,
      bidangCount: 0,
      kawasanCount: 0,
    };
  }
};
