// src/features/internal/data-management/api/data-management.api.ts

import type {
  CreateMasterIgtLayerPayload,
  MasterIgtLayersQueryParams,
  MasterIgtLayersResponse,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/data-management/types/data-management.type";
import { DUMMY_MASTER_IGT_LAYERS_RESPONSE } from "@/shared/constants/dummy-data/dummy-master-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const fetchMasterIgtLayersApi = async (
  params?: MasterIgtLayersQueryParams,
  signal?: AbortSignal,
): Promise<MasterIgtLayersResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<MasterIgtLayersResponse>>(
      "/api/internal/igt-layers",
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          search: params?.search,
          spatialBasis: params?.spatialBasis,
          isActive: params?.isActive,
        },
        signal,
      },
    );

    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? DUMMY_MASTER_IGT_LAYERS_RESPONSE
      : { items: [], pagination: DUMMY_MASTER_IGT_LAYERS_RESPONSE.pagination };
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("fetchMasterIgtLayersApi fallback to dummy data:", error);
      return DUMMY_MASTER_IGT_LAYERS_RESPONSE;
    }
    throw error;
  }
};

export const updateMasterIgtLayerApi = async (
  payload: UpdateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/igt-layers/${payload.id}`,
    payload,
    { signal },
  );
};

export const createMasterIgtLayerApi = async (
  payload: CreateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.post<ApiResponse<void>>(
    "/api/internal/igt-layers",
    payload,
    { signal },
  );
};

export const deleteMasterIgtLayerApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.delete<ApiResponse<void>>(
    `/api/internal/igt-layers/${id}`,
    { signal },
  );
};
