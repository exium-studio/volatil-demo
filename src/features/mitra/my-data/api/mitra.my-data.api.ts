// src/features/mitra/my-data/api/mitra.my-data.api.ts

import type {
  MitraWorkspaceItem,
  MitraWorkspaceListResponse,
  MitraWorkspaceQueryParams,
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
  RenewWorkspacePayload,
  RenewWorkspaceResponse,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraWorkspacesApi = async (
  params?: MitraWorkspaceQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraWorkspaceListResponse>> => {
  return apiClient.get<ApiResponse<MitraWorkspaceListResponse>>(
    "/api/mitra/my-data",
    {
      params,
      signal,
    },
  );
};

export const fetchMitraWorkspaceDetailApi = async (
  workspaceId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraWorkspaceItem>> => {
  return apiClient.get<ApiResponse<MitraWorkspaceItem>>(
    `/api/mitra/my-data/${workspaceId}`,
    {
      signal,
    },
  );
};

export const renewWorkspaceApi = async (
  workspaceId: string,
  payload: RenewWorkspacePayload,
  signal?: AbortSignal,
): Promise<ApiResponse<RenewWorkspaceResponse>> => {
  return apiClient.post<ApiResponse<RenewWorkspaceResponse>>(
    `/api/mitra/my-data/${workspaceId}/renew`,
    payload,
    { signal },
  );
};

export const fetchMyDataApi = async (
  params: MyDataQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<MyDataResponse>> => {
  return apiClient.get<ApiResponse<MyDataResponse>>("/api/mitra/my-data", {
    params,
    signal,
  });
};

export const updateMyDataItemApi = async (
  id: string,
  payload: UpdateMyDataItemPayload,
): Promise<ApiResponse<MyDataItem>> => {
  return apiClient.patch<ApiResponse<MyDataItem>>(
    `/api/mitra/my-data/${id}`,
    payload,
  );
};

