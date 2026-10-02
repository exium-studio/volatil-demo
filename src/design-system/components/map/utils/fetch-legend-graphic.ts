// src/design-system/components/map/utils/fetch-legend-graphic.ts

import type {
  FetchLegendGraphicParams,
  GeoServerLegendResponse,
  GeoServerLegendRule,
} from "@/design-system/components/map/types/map.symbology.type";

export const fetchLegendGraphic = async (
  params: FetchLegendGraphicParams,
): Promise<GeoServerLegendRule[] | null> => {
  const { layer, signal } = params;
  const wmsUrl = layer.wms?.wmsUrl;
  const layerName = layer.wms?.layers || layer.id;

  if (!wmsUrl || !layerName) return null;

  try {
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

    if (!response.ok) return null;

    const data = (await response.json()) as GeoServerLegendResponse;
    const rules = data?.Legend?.[0]?.rules;
    if (Array.isArray(rules) && rules.length > 0) {
      return rules;
    }
    return null;
  } catch {
    return null;
  }
};
