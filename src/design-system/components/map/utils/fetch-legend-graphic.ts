// src/design-system/components/map/utils/fetch-legend-graphic.ts

import type {
  FetchLegendGraphicParams,
  GeoServerLegendResponse,
  GeoServerLegendRule,
} from "@/design-system/components/map/types/map.symbology.type";
import { normalizeApiUrl } from "@/shared/utils/url/url.utils";

export const fetchLegendGraphic = async (
  params: FetchLegendGraphicParams,
): Promise<GeoServerLegendRule[]> => {
  const { layer, signal } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = layer as any;
  const rawWmsUrl =
    raw?.wms?.url ??
    raw?.wms?.wmsUrl ??
    raw?.wmsUrl ??
    raw?.externalWmsUrl ??
    raw?.wms?.baseUrl;
  const layerName =
    raw?.wms?.layers ??
    raw?.typeName ??
    raw?.wmsLayers ??
    raw?.wfsTypeName ??
    raw?.wfs?.typeName ??
    raw?.wfs?.wfsTypeName ??
    raw?.id ??
    "";
  const apiKey = raw?.apiKey ?? raw?.wms?.apiKey;

  if (!rawWmsUrl || !layerName) {
    throw new Error("Konfigurasi WMS layer tidak valid atau belum tersedia.");
  }

  const wmsUrl = normalizeApiUrl(rawWmsUrl);
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5174";
  const url = new URL(wmsUrl, origin);

  // Clean existing GetMap and conflicting query parameters
  const keysToRemove = [
    "request",
    "service",
    "version",
    "format",
    "layers",
    "layer",
    "srs",
    "crs",
    "bbox",
    "width",
    "height",
    "transparent",
    "styles",
  ];
  for (const key of Array.from(url.searchParams.keys())) {
    if (keysToRemove.includes(key.toLowerCase())) {
      url.searchParams.delete(key);
    }
  }

  // GeoServer standard OGC GetLegendGraphic params
  url.searchParams.set("service", "WMS");
  url.searchParams.set("request", "GetLegendGraphic");
  url.searchParams.set("version", "1.0.0");
  url.searchParams.set("format", "application/json");
  url.searchParams.set("layer", layerName);

  // Backend proxy requirement: layerId parameter (must be layer UUID if master IGT, or existing layerId param)
  if (!url.searchParams.has("layerId")) {
    const layerId = raw?.id || raw?.sourceLayerId || layerName;
    url.searchParams.set("layerId", layerId);
  }

  if (apiKey && !url.searchParams.has("apiKey")) {
    url.searchParams.set("apiKey", apiKey);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Gagal memuat simbologi GeoServer (${response.status} ${response.statusText})`,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Format response simbologi tidak valid (${contentType || "unknown"}). GeoServer backend mengembalikan non-JSON.`,
    );
  }

  const data = (await response.json()) as GeoServerLegendResponse;
  const rules = data?.Legend?.[0]?.rules;
  if (Array.isArray(rules) && rules.length > 0) {
    return rules;
  }

  throw new Error(
    `Tidak ada aturan simbologi SLD ditemukan untuk layer "${layer.title || layerName}"`,
  );
};
