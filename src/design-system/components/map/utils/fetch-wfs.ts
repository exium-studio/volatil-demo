// src/design-system/components/map/utils/fetch-wfs.ts

import type {
  FetchWfsParams,
  GeoServerFeatureCollection,
  RawGeoServerResponse,
  WfsVersion,
} from "@/design-system/components/map/types/map.fetch-wfs.type";
import { normalizeGeometryCoordinates } from "@/design-system/components/map/utils/geometry";
import {
  getApiBaseWmsProxyUrl,
  normalizeApiUrl,
} from "@/shared/utils/url/url.utils";

export const buildWfsUrl = (
  {
    typeName,
    wfsUrl,
    bbox,
    cqlFilter,
    featureID,
    resourceId,
    propertyName,
    version = "1.0.0",
    srsName = "EPSG:4326",
    maxFeatures,
    startIndex,
    resultType = "results",
  }: Omit<FetchWfsParams, "signal">,
  includeStartIndex = true,
) => {
  const apiBaseUrl = getApiBaseWmsProxyUrl();
  const defaultBaseUrl = `${apiBaseUrl}/api/proxy/wfs`;

  const rawUrl = wfsUrl || defaultBaseUrl;
  const targetUrlStr = normalizeApiUrl(rawUrl);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5174";
  const url = new URL(targetUrlStr, origin);

  if (!url.searchParams.has("layerId") && typeName) {
    url.searchParams.set("layerId", typeName);
  }
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", version);
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("outputFormat", "application/json");
  url.searchParams.set("srsName", srsName);

  if (version === "2.0.0") {
    url.searchParams.set("typeNames", typeName);
    if (maxFeatures != null) url.searchParams.set("count", String(maxFeatures));
    if (resourceId || featureID) {
      url.searchParams.set("resourceId", (resourceId || featureID)!);
    }
  } else {
    url.searchParams.set("typeName", typeName);
    if (maxFeatures != null)
      url.searchParams.set("maxFeatures", String(maxFeatures));
    if (featureID || resourceId) {
      url.searchParams.set("featureID", (featureID || resourceId)!);
    }
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

  if (propertyName) {
    url.searchParams.set("propertyName", propertyName);
  }

  return url;
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

// In-memory cache mapping typeName -> geometry property name (e.g. "the_geom", "geom", "shape")
const geometryColumnCache = new Map<string, string>();

/**
 * Dynamically queries GeoServer DescribeFeatureType to discover the exact geometry column name for a layer.
 * Caches the result in memory for subsequent queries.
 */
export const getLayerGeometryColumnName = async (
  typeName: string,
  wfsUrl?: string,
  signal?: AbortSignal,
): Promise<string> => {
  if (geometryColumnCache.has(typeName)) {
    return geometryColumnCache.get(typeName)!;
  }

  try {
    const apiBaseUrl = getApiBaseWmsProxyUrl();
    const defaultBaseUrl = `${apiBaseUrl}/api/proxy/wfs`;
    const targetUrlStr = normalizeApiUrl(wfsUrl || defaultBaseUrl);
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:5174";
    const url = new URL(targetUrlStr, origin);

    if (!url.searchParams.has("layerId") && typeName) {
      url.searchParams.set("layerId", typeName);
    }
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "1.0.0");
    url.searchParams.set("request", "DescribeFeatureType");
    url.searchParams.set("typeName", typeName);
    url.searchParams.set("outputFormat", "application/json");

    const res = await fetch(url.toString(), { signal });
    if (res.ok) {
      const data = await res.json();
      const element = data?.featureTypes?.[0]?.properties?.find(
        (p: { type?: string; localType?: string }) => {
          const typeStr = (p.type || p.localType || "").toLowerCase();
          return (
            typeStr.startsWith("gml:") ||
            typeStr.includes("geometry") ||
            typeStr.includes("polygon") ||
            typeStr.includes("point") ||
            typeStr.includes("linestring") ||
            typeStr.includes("multipolygon")
          );
        },
      );
      if (element?.name) {
        geometryColumnCache.set(typeName, element.name);
        return element.name;
      }
    }
  } catch {
    // Fallback gracefully to the_geom
  }

  return "the_geom";
};

// -------------------------------------------------------------------------------------

/**
 * Executes a WFS GetFeature request via POST (application/x-www-form-urlencoded).
 * Used when the GET URL exceeds browser/server URL length limits (HTTP 414).
 * GeoServer supports WFS POST natively per the OGC WFS specification.
 */
const fetchWfsPost = async (
  params: FetchWfsParams,
  includeStartIndex = true,
): Promise<Response> => {
  const url = buildWfsUrl(params, includeStartIndex);

  // Extract base endpoint (strip all query params — they go into POST body)
  const baseUrl = `${url.origin}${url.pathname}`;
  const body = url.searchParams.toString();

  return fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: params.signal,
  });
};

/** Fetches features from a WFS endpoint as GeoJSON with automatic GeoServer NPE and adaptive column fallback. */
export const fetchWfs = async (
  params: FetchWfsParams,
): Promise<GeoServerFeatureCollection> => {
  const { version = "1.0.0", signal, startIndex = 0, maxFeatures } = params;

  let url = buildWfsUrl(params, true);
  let res: Response;

  // Use POST when explicitly requested, when method is not GET, when cqlFilter is present, or when URL is too long
  const usePost =
    params.method === "POST" ||
    params.method !== "GET" ||
    Boolean(params.cqlFilter) ||
    url.toString().length > 2000;

  try {
    res = usePost
      ? await fetchWfsPost(params, true)
      : await fetch(url.toString(), { signal });
  } catch (err: unknown) {
    if (signal?.aborted || (err as { name?: string }).name === "AbortError") {
      throw err;
    }
    if (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      !navigator.onLine
    ) {
      window.dispatchEvent(new CustomEvent("app:network-offline"));
    }
    throw err;
  }

  // Retry as POST if server returned 414 URI Too Long
  if (res.status === 414) {
    try {
      res = await fetchWfsPost(params, true);
    } catch (err: unknown) {
      if (signal?.aborted || (err as { name?: string }).name === "AbortError") {
        throw err;
      }
      throw err;
    }
  }

  // If server throws 400 Bad Request due to GeoServer startIndex NullPointerException bug, retry without startIndex
  if (!res.ok && res.status === 400 && startIndex > 0) {
    console.warn(
      "GeoServer rejected startIndex with 400 NPE. Falling back to fetching without startIndex.",
    );
    url = buildWfsUrl({ ...params, maxFeatures: undefined }, false);
    try {
      res = usePost
        ? await fetchWfsPost({ ...params, maxFeatures: undefined }, false)
        : await fetch(url.toString(), { signal });
    } catch (err: unknown) {
      if (signal?.aborted || (err as { name?: string }).name === "AbortError") {
        throw err;
      }
      if (
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        !navigator.onLine
      ) {
        window.dispatchEvent(new CustomEvent("app:network-offline"));
      }
      throw err;
    }
  }

  // If server throws 400 Bad Request due to GeoServer CQL_FILTER errors (e.g. geometry column name mismatch)
  if (!res.ok && res.status === 400 && params.cqlFilter) {
    const discoveredGeomName = await getLayerGeometryColumnName(
      params.typeName,
      params.wfsUrl,
      signal,
    );

    let adaptedFilter = params.cqlFilter;
    if (discoveredGeomName) {
      adaptedFilter = adaptedFilter
        .replace(/\bthe_geom\b/gi, discoveredGeomName)
        .replace(/\bgeom\b/gi, discoveredGeomName);
    }

    if (adaptedFilter !== params.cqlFilter) {
      const adaptedParams = { ...params, cqlFilter: adaptedFilter };
      url = buildWfsUrl(adaptedParams, true);
      res =
        usePost || url.toString().length > 2000
          ? await fetchWfsPost(adaptedParams, true)
          : await fetch(url.toString(), { signal });
    } else {
      // Fallback swap if discovered name is the same as current
      const fallbackFilter = /\bthe_geom\b/i.test(params.cqlFilter)
        ? params.cqlFilter.replace(/\bthe_geom\b/gi, "geom")
        : params.cqlFilter.replace(/\bgeom\b/gi, "the_geom");
      const fallbackParams = { ...params, cqlFilter: fallbackFilter };
      url = buildWfsUrl(fallbackParams, true);
      res =
        usePost || url.toString().length > 2000
          ? await fetchWfsPost(fallbackParams, true)
          : await fetch(url.toString(), { signal });
    }
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error(
      `WFS request failed [${res.status}] for "${params.typeName}". Response:`,
      errorText,
    );
    throw new Error(
      `WFS request failed for "${params.typeName}": ${res.status}${
        errorText ? ` - ${errorText.slice(0, 150)}` : ""
      }`,
    );
  }

  let text = await res.text();
  let trimmedText = text.trim();

  // If GeoServer returned XML ServiceException with 200 OK
  if (
    trimmedText.startsWith("<ServiceExceptionReport") ||
    trimmedText.startsWith("<ServiceException") ||
    trimmedText.startsWith("<ows:ExceptionReport") ||
    trimmedText.includes("<ows:ExceptionText>") ||
    trimmedText.includes("ServiceException")
  ) {
    if (params.cqlFilter) {
      const discoveredGeomName = await getLayerGeometryColumnName(
        params.typeName,
        params.wfsUrl,
        signal,
      );

      let adaptedFilter = params.cqlFilter;
      if (discoveredGeomName) {
        adaptedFilter = adaptedFilter
          .replace(/\bthe_geom\b/gi, discoveredGeomName)
          .replace(/\bgeom\b/gi, discoveredGeomName);
      } else {
        adaptedFilter = /\bthe_geom\b/i.test(params.cqlFilter)
          ? params.cqlFilter.replace(/\bthe_geom\b/gi, "geom")
          : params.cqlFilter.replace(/\bgeom\b/gi, "the_geom");
      }

      const retryParams = { ...params, cqlFilter: adaptedFilter };
      const retryUrl = buildWfsUrl(retryParams, true);
      const retryRes =
        usePost || retryUrl.toString().length > 2000
          ? await fetchWfsPost(retryParams, true)
          : await fetch(retryUrl.toString(), { signal });
      if (retryRes.ok) {
        text = await retryRes.text();
        trimmedText = text.trim();
      }
    }

    if (
      trimmedText.startsWith("<ServiceExceptionReport") ||
      trimmedText.startsWith("<ServiceException") ||
      trimmedText.startsWith("<ows:ExceptionReport") ||
      trimmedText.includes("<ows:ExceptionText>")
    ) {
      const matchText =
        /<ows:ExceptionText>(.*?)<\/ows:ExceptionText>/s.exec(text) ||
        /<ServiceException.*?>(.*?)<\/ServiceException>/s.exec(text);
      const errorMsg = matchText?.[1]?.trim() ?? "WFS OGC Exception occurred";
      throw new Error(`WFS OGC Error (${version}): ${errorMsg}`);
    }
  }

  // When resultType=hits, some GeoServer versions return XML FeatureCollection instead of JSON
  if (
    trimmedText.startsWith("<?xml") ||
    trimmedText.startsWith("<wfs:FeatureCollection")
  ) {
    const numberMatchedMatch = /numberMatched="(\d+)"/i.exec(text);
    const numberOfFeaturesMatch = /numberOfFeatures="(\d+)"/i.exec(text);
    const totalFeaturesMatch = /totalFeatures="(\d+)"/i.exec(text);
    const count =
      numberMatchedMatch?.[1] ??
      numberOfFeaturesMatch?.[1] ??
      totalFeaturesMatch?.[1] ??
      "0";

    return {
      type: "FeatureCollection",
      features: [],
      totalFeatures: parseInt(count, 10),
    };
  }

  const raw = JSON.parse(text) as RawGeoServerResponse;
  const total = normalizeTotalFeatures(raw, version);
  let features = (raw.features ?? []).map((feat) => {
    if (feat.geometry) {
      return {
        ...feat,
        geometry: normalizeGeometryCoordinates(feat.geometry),
      };
    }
    return feat;
  });

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
