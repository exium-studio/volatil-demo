import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { DUMMY_IGT_LAYERS } from "@/shared/constants/dummy-data/dummy-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

const EMPTY_LAYERS_RESPONSE: IgtLayersResponse = {
  items: [],
};

export async function getIgtLayers(
  signal?: AbortSignal,
): Promise<IgtLayersResponse> {
  const user = getUserSession();
  const isInternal = user?.role === "internal";
  const endpoint = isInternal
    ? "/api/internal/igt-layers"
    : "/api/mitra/igt-layers";

  try {
    const response = await apiClient.get<
      ApiResponse<IgtLayersResponse> | IgtLayersResponse
    >(endpoint, {
      signal,
    });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as IgtLayersResponse);

    if (resultData && resultData.items) {
      return {
        items: resultData.items,
        pagination: resultData.pagination,
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
