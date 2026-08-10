// src/design-system/components/map/utils/fetch-wfs.ts

import type GeoJSON from "geojson";

export type WfsBbox = [number, number, number, number];

/** Supported WFS specification versions. */
export type WfsVersion = "1.0.0" | "1.1.0" | "2.0.0";

/**
 * GeoServer returns a non-standard JSON extension for FeatureCollection.
 * - v1.0.0 / v1.1.0: `totalFeatures`, `numberOfFeatures`
 * - v2.0.0: `numberMatched`, `totalFeatures`
 * All are normalized to `totalFeatures` on the return type.
 */
export type GeoServerFeatureCollection = GeoJSON.FeatureCollection & {
  /** Normalized total matched features count (across all pages). */
  totalFeatures: number;
};

export type FetchWfsParams = {
  typeName: string;
  wfsUrl?: string;
  bbox?: WfsBbox;
  /** GeoServer CQL filter expression, e.g. `INTERSECTS(geom, POLYGON(...))`. */
  cqlFilter?: string;
  /** WFS spec version. Defaults to "2.0.0". */
  version?: WfsVersion;
  srsName?: string;
  /** Max features per page. Maps to `count` (v2.0.0) or `maxFeatures` (v1.x). */
  maxFeatures?: number;
  /** Zero-based page offset. Supported in v1.1.0 and v2.0.0. */
  startIndex?: number;
  /**
   * `hits` → fast count query.
   * `results` → actual features (default).
   */
  resultType?: "results" | "hits";
  signal?: AbortSignal;
};

// -------------------------------------------------------------------------------------

const buildWfsUrl = (
  {
    typeName,
    wfsUrl,
    bbox,
    cqlFilter,
    version = "2.0.0",
    srsName = "EPSG:4326",
    maxFeatures,
    startIndex,
    resultType = "results",
  }: Omit<FetchWfsParams, "signal">,
  includeStartIndex = true,
) => {
  const baseUrl = wfsUrl ?? "https://igtpr.atrbpn.go.id/geoserver/igt/ows";
  const url = new URL(baseUrl);

  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", version);
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("outputFormat", "application/json");
  url.searchParams.set("srsName", srsName);

  if (version === "2.0.0") {
    url.searchParams.set("typeNames", typeName);
    if (maxFeatures != null) url.searchParams.set("count", String(maxFeatures));
  } else {
    url.searchParams.set("typeName", typeName);
    if (maxFeatures != null)
      url.searchParams.set("maxFeatures", String(maxFeatures));
  }

  // NOTE: Some GeoServer builds throw NullPointerException when startIndex is present.
  // Only add startIndex if explicitly requested and > 0, or if includeStartIndex is true.
  if (
    includeStartIndex &&
    startIndex != null &&
    startIndex > 0 &&
    version !== "1.0.0"
  ) {
    url.searchParams.set("startIndex", String(startIndex));
  }

  if (version !== "1.0.0" && resultType === "hits") {
    url.searchParams.set("resultType", "hits");
  }

  if (bbox) {
    url.searchParams.set("bbox", `${bbox.join(",")},${srsName}`);
  }

  if (cqlFilter) {
    url.searchParams.set("CQL_FILTER", cqlFilter);
  }

  return url;
};

type RawGeoServerResponse = GeoJSON.FeatureCollection & {
  totalFeatures?: number;
  numberMatched?: number;
  numberOfFeatures?: number;
};

const normalizeTotalFeatures = (
  raw: RawGeoServerResponse,
  version: WfsVersion,
): number => {
  if (version === "2.0.0") {
    return raw.numberMatched ?? raw.totalFeatures ?? raw.features?.length ?? 0;
  }
  return raw.totalFeatures ?? raw.numberOfFeatures ?? raw.features?.length ?? 0;
};

// -------------------------------------------------------------------------------------

/** Fetches features from a WFS endpoint as GeoJSON with automatic GeoServer NPE fallback. */
export const fetchWfs = async (
  params: FetchWfsParams,
): Promise<GeoServerFeatureCollection> => {
  const { version = "2.0.0", signal, startIndex = 0, maxFeatures } = params;

  let url = buildWfsUrl(params, true);
  let res = await fetch(url.toString(), { signal });

  // If server throws 400 Bad Request due to GeoServer startIndex NullPointerException bug, retry without startIndex
  if (!res.ok && res.status === 400 && startIndex > 0) {
    console.warn(
      "GeoServer rejected startIndex with 400 NPE. Falling back to fetching without startIndex.",
    );
    url = buildWfsUrl({ ...params, maxFeatures: undefined }, false);
    res = await fetch(url.toString(), { signal });
  }

  if (!res.ok) {
    throw new Error(
      `WFS request failed for "${params.typeName}": ${res.status}`,
    );
  }

  const text = await res.text();

  if (
    text.trim().startsWith("<?xml") ||
    text.trim().startsWith("<ows:ExceptionReport")
  ) {
    const matchText = /<ows:ExceptionText>(.*?)<\/ows:ExceptionText>/s.exec(
      text,
    );
    const errorMsg = matchText?.[1]?.trim() ?? "WFS OGC Exception occurred";
    throw new Error(`WFS OGC Error (${version}): ${errorMsg}`);
  }

  const raw = JSON.parse(text) as RawGeoServerResponse;
  const total = normalizeTotalFeatures(raw, version);
  let features = raw.features ?? [];

  // If we had to fallback to fetching without startIndex, slice features on client-side
  if (startIndex > 0 && features.length > startIndex && maxFeatures != null) {
    features = features.slice(startIndex, startIndex + maxFeatures);
  }

  return {
    ...raw,
    features,
    totalFeatures: total,
  };
};
