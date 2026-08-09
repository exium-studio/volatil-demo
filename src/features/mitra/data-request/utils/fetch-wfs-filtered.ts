// src/features/mitra/data-request/utils/fetch-wfs-filtered.ts

import {
  WFS_BASE_URL,
  WFS_OUTPUT_FORMAT,
  WFS_SRS_NAME,
  WFS_VERSION,
} from "@/design-system/components/map/constants/map.config";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type GeoJSON from "geojson";

export type WfsFilterParams = {
  typeName: string;
  filters?: Record<string, string | undefined>;
  startIndex?: number;
  count?: number;
  signal?: AbortSignal;
};

/**
 * Builds a CQL filter string from a filters object (skipping undefined/empty values)
 * and fetches WFS features with optional pagination (startIndex, count).
 */
export const fetchWfsFiltered = async (
  params: WfsFilterParams,
): Promise<GeoJSON.FeatureCollection> => {
  // Params
  const { typeName, filters = {}, startIndex, count, signal } = params;

  // Build CQL filter conditions skipping key with undefined or empty string values
  const conditions = Object.entries(filters)
    .filter(([, val]) => val !== undefined && val !== "")
    .map(([key, val]) => `${key}='${val}'`);

  const cqlFilter = conditions.length > 0 ? conditions.join(" AND ") : undefined;

  // If pagination (startIndex/count) is provided, construct URL directly to pass pagination params
  if (startIndex !== undefined || count !== undefined) {
    const url = new URL(WFS_BASE_URL);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", WFS_VERSION);
    url.searchParams.set("request", "GetFeature");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", WFS_OUTPUT_FORMAT);
    url.searchParams.set("srsName", WFS_SRS_NAME);

    if (cqlFilter) {
      url.searchParams.set("CQL_FILTER", cqlFilter);
    }
    if (startIndex !== undefined) {
      url.searchParams.set("startIndex", String(startIndex));
    }
    if (count !== undefined) {
      url.searchParams.set("count", String(count));
    }

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) {
      throw new Error(`WFS request failed for "${typeName}": ${res.status}`);
    }
    return res.json() as Promise<GeoJSON.FeatureCollection>;
  }

  return fetchWfs({
    typeName,
    cqlFilter,
    signal,
  });
};
