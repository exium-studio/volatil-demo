// src/design-system/components/map/utils/fetch-legend-graphic.ts

import type {
  FetchLegendGraphicParams,
  GeoServerLegendResponse,
  GeoServerLegendRule,
} from "@/design-system/components/map/types/map.symbology.type";
import { normalizeApiUrl } from "@/shared/utils/env/env.utils";

export const fetchLegendGraphic = async (
  params: FetchLegendGraphicParams,
): Promise<GeoServerLegendRule[]> => {
  const { layer, signal } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = layer as any;
  const rawWmsUrl = raw?.wms?.wmsUrl ?? raw?.wmsUrl;
  const wmsUrl = normalizeApiUrl(rawWmsUrl);
  const layerName =
    raw?.wms?.layers ?? raw?.layers ?? raw?.typeName ?? layer.id;

  if (!wmsUrl || !layerName) {
    throw new Error("Konfigurasi WMS layer tidak valid atau belum tersedia.");
  }

  const separator = wmsUrl.includes("?") ? "&" : "?";
  const url = `${wmsUrl}${separator}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=application/json&LAYER=${encodeURIComponent(
    layerName,
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
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
