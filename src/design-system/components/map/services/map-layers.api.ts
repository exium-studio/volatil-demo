// src/design-system/components/map/services/map-layers.api.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { DUMMY_MAP_LAYERS } from "@/shared/constants/dummy-data/dummy-map-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export { DUMMY_MAP_LAYERS };

export async function getIgtLayers(
  signal?: AbortSignal,
): Promise<IgtLayersResponse> {
  try {
    const response = await apiClient.get<ApiResponse<IgtLayersResponse>>(
      "/mitra/igt-layers",
      {
        signal,
      },
    );
    return response.data ?? DUMMY_MAP_LAYERS;
  } catch (error) {
    console.warn("getIgtLayers API error, trying fallback endpoint /map/layers:", error);
    try {
      const fallbackResponse = await apiClient.get<ApiResponse<IgtLayersResponse>>(
        "/map/layers",
        {
          signal,
        },
      );
      return fallbackResponse.data ?? DUMMY_MAP_LAYERS;
    } catch {
      return DUMMY_MAP_LAYERS;
    }
  }
}
