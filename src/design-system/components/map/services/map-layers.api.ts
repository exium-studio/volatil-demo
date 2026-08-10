// src/design-system/components/map/services/map-layers.api.ts

import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { DUMMY_MAP_LAYERS } from "@/shared/constants/dummy-data/dummy-map-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export { DUMMY_MAP_LAYERS };

export async function getMapLayers(
  signal?: AbortSignal,
): Promise<MapLayerConfig[]> {
  try {
    const response = await apiClient.get<ApiResponse<MapLayerConfig[]>>(
      "/map/layers",
      {
        signal,
      },
    );
    return response.data ?? DUMMY_MAP_LAYERS;
  } catch (error) {
    console.warn("getMapLayers API error, falling back to dummy data:", error);
    return DUMMY_MAP_LAYERS;
  }
}
