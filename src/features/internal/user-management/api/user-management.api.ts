// src/features/internal/user-management/api/user-management.api.ts

import type {
  AdminUserDetailApiResponse,
  AdminUsersApiResponse,
  AdminUsersStatisticsApiResponse,
} from "@/features/internal/user-management/types/user-management.api.type";
import type {
  UpdateUserStatusPayload,
  UserManagementQueryParams,
} from "@/features/internal/user-management/types/user-management.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const fetchAdminUsersApi = async (
  params?: UserManagementQueryParams,
  signal?: AbortSignal,
): Promise<AdminUsersApiResponse> => {
  const queryParams: Record<string, string | number | boolean | undefined> = {};

  if (params?.page) queryParams.page = params.page;
  if (params?.pageSize) queryParams.limit = params.pageSize;
  if (params?.search) queryParams.search = params.search;
  if (params?.role) queryParams.role = params.role;
  if (params?.status) queryParams.status = params.status;

  return apiClient.get<AdminUsersApiResponse>("/api/internal/user-management", {
    params: queryParams,
    signal,
  });
};

export const fetchAdminUsersStatisticsApi = async (
  signal?: AbortSignal,
): Promise<AdminUsersStatisticsApiResponse> => {
  return apiClient.get<AdminUsersStatisticsApiResponse>(
    "/api/internal/user-management/statistics",
    {
      signal,
    },
  );
};

export const fetchAdminUserDetailApi = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<AdminUserDetailApiResponse> => {
  return apiClient.get<AdminUserDetailApiResponse>(
    `/api/internal/user-management/${id}`,
    {
      signal,
    },
  );
};

export const patchAdminUserStatusApi = async (
  payload: UpdateUserStatusPayload,
  signal?: AbortSignal,
): Promise<AdminUserDetailApiResponse> => {
  return apiClient.request<AdminUserDetailApiResponse>(
    `/api/internal/user-management/${payload.id}/status`,
    {
      method: "PATCH",
      body: { status: payload.status },
      signal,
    },
  );
};
