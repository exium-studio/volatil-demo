// src/design-system/components/map/services/map-layers.api.ts

import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { DEFAULT_MAP_SERVER_ENDPOINT } from "@/design-system/components/map/constants/map.config";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

const DUMMY_MAP_LAYERS: MapLayerConfig[] = [
  {
    id: "igt-bidang-tanah-wms-raster",
    type: "wms-raster",
    wmsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wmsUrl,
    layers: "igt:CONTOH_BIDANG_TANAH",
    visible: true,
  },
];

export async function getMapLayers(signal?: AbortSignal): Promise<MapLayerConfig[]> {
  try {
    const response = await apiClient.get<ApiResponse<MapLayerConfig[]>>("/map/layers", {
      signal,
    });
    return response.data ?? DUMMY_MAP_LAYERS;
  } catch (error) {
    console.warn("getMapLayers API error, falling back to dummy data:", error);
    return DUMMY_MAP_LAYERS;
  }
}
