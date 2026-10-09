// src/features/internal/home/api/internal.home.policies.api.ts

import type { InternalHomePolicyItem } from "@/features/internal/home/types/internal.home.policies.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalHomePoliciesApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<InternalHomePolicyItem[]>> => {
  return apiClient.get<ApiResponse<InternalHomePolicyItem[]>>(
    "/api/internal/policies",
    { signal },
  );
};
