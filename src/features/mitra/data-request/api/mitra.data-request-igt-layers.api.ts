import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { DUMMY_IGT_LAYERS } from "@/shared/constants/dummy-data/dummy-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_LAYERS_RESPONSE: IgtLayersResponse = {
  items: [],
};

export async function getIgtLayers(
  signal?: AbortSignal,
): Promise<IgtLayersResponse> {
  try {
    const response = await apiClient.get<ApiResponse<IgtLayersResponse>>(
      "/api/mitra/igt-layers",
      {
        signal,
      },
    );

    if (response && response.data) {
      const d = response.data;
      return {
        items: d.items ?? d.layers ?? [],
        pagination: d.pagination,
      };
    }
    return isDummyDataEnabled() ? DUMMY_IGT_LAYERS : EMPTY_LAYERS_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "getIgtLayers API error, falling back to dummy data:",
        error,
      );
      return DUMMY_IGT_LAYERS;
    }
    return EMPTY_LAYERS_RESPONSE;
  }
}
