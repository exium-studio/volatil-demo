import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { DUMMY_IGT_LAYERS } from "@/shared/constants/dummy-data/dummy-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_LAYERS_RESPONSE: IgtLayersResponse = {
  layers: [],
};

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
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled() ? DUMMY_IGT_LAYERS : EMPTY_LAYERS_RESPONSE;
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
      if (fallbackResponse.data) {
        return fallbackResponse.data;
      }
      return isDummyDataEnabled() ? DUMMY_IGT_LAYERS : EMPTY_LAYERS_RESPONSE;
    } catch {
      return isDummyDataEnabled() ? DUMMY_IGT_LAYERS : EMPTY_LAYERS_RESPONSE;
    }
  }
}
