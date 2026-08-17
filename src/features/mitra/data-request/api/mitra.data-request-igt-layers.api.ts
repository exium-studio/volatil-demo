// src/features/mitra/data-request/api/mitra.data-request-igt-layers.api.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { DUMMY_IGT_LAYERS } from "@/shared/constants/dummy-data/dummy-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

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
    return response.data ?? DUMMY_IGT_LAYERS;
  } catch (error) {
    console.warn(
      "getIgtLayers API error, trying fallback endpoint /map/layers:",
      error,
    );
    try {
      const fallbackResponse = await apiClient.get<
        ApiResponse<IgtLayersResponse>
      >("/map/layers", {
        signal,
      });
      return fallbackResponse.data ?? DUMMY_IGT_LAYERS;
    } catch {
      return DUMMY_IGT_LAYERS;
    }
  }
}
