// src/design-system/components/map/utils/wms-get-feature-info.ts

import type { GetFeatureInfoOptions } from "@/design-system/components/map/types/map.feature-info.type";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";

export const fetchWmsGetFeatureInfo = async (
  options: GetFeatureInfoOptions,
): Promise<GeoJSON.FeatureCollection | null> => {
  const { wmsUrl, layers, point, map, cqlFilter } = options;
  const bounds = map.getBounds();
  const canvas = map.getCanvas();
  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 600;

  const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

  const rawBase = wmsUrl
    ? buildWmsProxyUrl(wmsUrl)
    : buildWmsProxyUrl("/api/proxy/wms");

  const [baseUrl, existingSearch] = rawBase.split("?");
  const queryParams: Record<string, string> = {
    service: "WMS",
    version: "1.1.1",
    request: "GetFeatureInfo",
    layers,
    query_layers: layers,
    styles: "",
    bbox,
    width: String(Math.round(width)),
    height: String(Math.round(height)),
    x: String(Math.round(point.x)),
    y: String(Math.round(point.y)),
    srs: "EPSG:4326",
    info_format: "application/json",
    feature_count: "5",
  };

  if (cqlFilter) {
    queryParams.cql_filter = cqlFilter;
  }

  const params = new URLSearchParams(existingSearch || "");
  Object.entries(queryParams).forEach(([k, v]) => {
    params.set(k, v);
  });

  const url = `${baseUrl}?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data as GeoJSON.FeatureCollection;
  } catch {
    return null;
  }
};
