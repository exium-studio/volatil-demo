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
    const response = await apiClient.get<
      ApiResponse<MasterIgtLayersResponse> | MasterIgtLayersResponse
    >("/api/internal/igt-layers", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        spatialBasis: params?.spatialBasis,
        isActive: params?.isActive,
      },
      signal,
    });

    // Handle standard ApiResponse wrapper or direct response payload
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterIgtLayersResponse);

    if (resultData && Array.isArray(resultData.items)) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return DUMMY_MASTER_IGT_LAYERS_RESPONSE;
    }

    return {
      items: [],
      pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
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
