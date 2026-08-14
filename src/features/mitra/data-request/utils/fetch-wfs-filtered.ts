// src/features/mitra/data-request/utils/fetch-wfs-filtered.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type GeoJSON from "geojson";

const FALLBACK_ENDPOINT = {
  wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
  wfsVersion: "1.0.0",
  outputFormat: "application/json",
  srsName: "EPSG:4326",
};

export type WfsFilterParams = {
  typeName: string;
  wfsUrl?: string;
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
  const { typeName, wfsUrl, filters = {}, startIndex, count, signal } = params;

  // Build CQL filter conditions skipping key with undefined or empty string values
  const conditions = Object.entries(filters)
    .filter(([, val]) => val !== undefined && val !== "")
    .map(([key, val]) => `${key}='${val}'`);

  const cqlFilter = conditions.length > 0 ? conditions.join(" AND ") : undefined;

  // If pagination (startIndex/count) is provided, construct URL directly to pass pagination params
  if (startIndex !== undefined || count !== undefined) {
    const baseUrl = wfsUrl ?? FALLBACK_ENDPOINT.wfsUrl;
    const url = new URL(baseUrl);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", FALLBACK_ENDPOINT.wfsVersion ?? "1.0.0");
    url.searchParams.set("request", "GetFeature");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", FALLBACK_ENDPOINT.outputFormat ?? "application/json");
    url.searchParams.set("srsName", FALLBACK_ENDPOINT.srsName ?? "EPSG:4326");

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
    wfsUrl,
    cqlFilter,
    signal,
  });
};
