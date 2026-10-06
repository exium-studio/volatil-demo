// src/design-system/components/map/utils/wms-get-feature-info.ts

import type { GetFeatureInfoOptions } from "@/design-system/components/map/types/map.feature-info.type";
import { normalizeApiUrl } from "@/shared/utils/env/env.utils";

export const fetchWmsGetFeatureInfo = async (
  options: GetFeatureInfoOptions,
): Promise<GeoJSON.FeatureCollection | null> => {
  const { wmsUrl, layerId, layers, point, lngLat, map, cqlFilter } = options;
  if (!wmsUrl) return null;

  const bounds = map.getBounds();
  const canvas = map.getCanvas();
  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 600;

  const west = bounds.getWest();
  const east = bounds.getEast();
  const south = bounds.getSouth();
  const north = bounds.getNorth();
  const bbox = `${west},${south},${east},${north}`;

  // Calculate linear equirectangular X/Y for accurate EPSG:4326 GeoServer mapping
  let clickX = Math.round(point.x);
  let clickY = Math.round(point.y);

  if (lngLat) {
    const calculatedX = Math.round(
      ((lngLat.lng - west) / (east - west)) * width,
    );
    const calculatedY = Math.round(
      ((north - lngLat.lat) / (north - south)) * height,
    );
    if (!isNaN(calculatedX) && calculatedX >= 0 && calculatedX <= width) {
      clickX = calculatedX;
    }
    if (!isNaN(calculatedY) && calculatedY >= 0 && calculatedY <= height) {
      clickY = calculatedY;
    }
  }

  const fullWmsUrl = normalizeApiUrl(wmsUrl);
  const [baseUrl, existingSearch] = fullWmsUrl.split("?");
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
    x: String(clickX),
    y: String(clickY),
    buffer: "30", // Search tolerance in pixels so small parcels/polygons are never missed
    srs: "EPSG:4326",
    info_format: "application/json",
    feature_count: "10",
  };

  if (layerId) {
    queryParams.layerId = layerId;
  }

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
