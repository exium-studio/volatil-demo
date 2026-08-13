// src/features/mitra/data-request/services/fetch-wfs-catalog.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { WFS_BIDANG_ATTRIBUTES } from "@/features/mitra/data-request/constants/mitra.data-request.constant";
import type GeoJSON from "geojson";

const DEFAULT_WFS_TYPE_NAME = "igt:CONTOH_BIDANG_TANAH";

export type FetchWfsCatalogParams = {
  typeName?: string;
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
  typeName = DEFAULT_WFS_TYPE_NAME,
  page,
  pageSize,
  cqlFilter,
  search,
  signal,
}: FetchWfsCatalogParams): Promise<FetchWfsCatalogResult> => {
  const startIndex = (page - 1) * pageSize;

  // Build search CQL using WFS attribute keys; strToLowerCase for case-insensitive LIKE (GeoServer CQL)
  const trimmedSearch = search?.trim();
  const searchCql =
    trimmedSearch && trimmedSearch.length > 0
      ? WFS_BIDANG_ATTRIBUTES.map(
          (attr) =>
            `strToLowerCase(${attr}) LIKE '%${trimmedSearch.toLowerCase()}%'`,
        ).join(" OR ")
      : undefined;

  const mergedCqlFilter =
    [cqlFilter, searchCql ? `(${searchCql})` : undefined]
      .filter(Boolean)
      .join(" AND ") || undefined;

  try {
    // Fetch current page of actual features using WFS 2.0.0
    const pageResult = await fetchWfs({
      typeName,
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
