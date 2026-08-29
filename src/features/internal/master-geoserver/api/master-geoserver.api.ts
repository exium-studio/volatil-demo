// src/features/internal/master-geoserver/api/master-geoserver.api.ts

import type {
  CreateMasterGeoserverPayload,
  MasterGeoserverItem,
  MasterGeoserverListResponse,
  MasterGeoserverQueryParams,
  UpdateMasterGeoserverPayload,
} from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMasterGeoserverListApi = async (
  params?: MasterGeoserverQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<MasterGeoserverListResponse> | MasterGeoserverListResponse> => {
  return apiClient.get<
    ApiResponse<MasterGeoserverListResponse> | MasterGeoserverListResponse
  >("/api/internal/master-geoserver", {
    params: {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
    },
    signal,
  });
};

export const fetchMasterGeoserverDetailApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<MasterGeoserverItem> | MasterGeoserverItem> => {
  return apiClient.get<
    ApiResponse<MasterGeoserverItem> | MasterGeoserverItem
  >(`/api/internal/master-geoserver/${id}`, { signal });
};

export const createMasterGeoserverApi = async (
  payload: CreateMasterGeoserverPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<MasterGeoserverItem> | MasterGeoserverItem> => {
  return apiClient.post<
    ApiResponse<MasterGeoserverItem> | MasterGeoserverItem
  >("/api/internal/master-geoserver", payload, { signal });
};

export const updateMasterGeoserverApi = async (
  payload: UpdateMasterGeoserverPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<MasterGeoserverItem> | MasterGeoserverItem> => {
  return apiClient.put<
    ApiResponse<MasterGeoserverItem> | MasterGeoserverItem
  >(`/api/internal/master-geoserver/${payload.id}`, payload, { signal });
};

export const deleteMasterGeoserverApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<{ success: boolean; deletedAt: string }> | { success: boolean; deletedAt: string }> => {
  return apiClient.delete<
    ApiResponse<{ success: boolean; deletedAt: string }> | { success: boolean; deletedAt: string }
  >(`/api/internal/master-geoserver/${id}`, { signal });
};
