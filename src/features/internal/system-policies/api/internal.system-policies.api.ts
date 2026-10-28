// src/features/internal/system-policies/api/internal.system-policies.api.ts

import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalSystemPoliciesApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<SystemPolicyItem[]>> => {
  return apiClient.get<ApiResponse<SystemPolicyItem[]>>(
    "/api/internal/policies",
    { signal },
  );
};

export const updateInternalSystemPolicyApi = async (
  key: string,
  value: number | string,
  signal?: AbortSignal,
): Promise<ApiResponse<SystemPolicyItem>> => {
  return apiClient.put<ApiResponse<SystemPolicyItem>>(
    `/api/internal/policies/${key}`,
    { value },
    { signal },
  );
};
