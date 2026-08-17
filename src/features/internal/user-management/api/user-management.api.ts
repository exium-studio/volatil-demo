// src/features/internal/user-management/api/user-management.api.ts

import type {
  UserManagementDataResponse,
  UserManagementQueryParams,
} from "@/features/internal/user-management/types/user-management.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchUserManagementDataApi = async (
  params?: UserManagementQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<UserManagementDataResponse>> => {
  return apiClient.get<ApiResponse<UserManagementDataResponse>>(
    "/internal/user-management",
    {
      params,
      signal,
    },
  );
};
