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
    raw?.wms?.wmsUrl ??
    raw?.wms?.url ??
    raw?.externalWmsUrl ??
    raw?.wmsUrl;
  const wmsUrl = normalizeApiUrl(rawWmsUrl);
  const layerName =
    raw?.wms?.layers ??
    raw?.wmsLayers ??
    raw?.layers ??
    raw?.wfsTypeName ??
    raw?.typeName ??
    raw?.id ??
    "";
  const apiKey = raw?.apiKey;

  if (!wmsUrl || !layerName) {
    throw new Error("Konfigurasi WMS layer tidak valid atau belum tersedia.");
  }

  const separator = wmsUrl.includes("?") ? "&" : "?";
  let url = `${wmsUrl}${separator}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=application/json&LAYER=${encodeURIComponent(
    layerName,
  )}`;

  if (apiKey) {
    url += `&apiKey=${encodeURIComponent(apiKey)}`;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Gagal memuat simbologi GeoServer (${response.status} ${response.statusText})`,
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
