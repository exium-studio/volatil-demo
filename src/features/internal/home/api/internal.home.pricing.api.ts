// src/features/internal/home/api/internal.home.pricing.api.ts

import type { InternalHomePricingItem } from "@/features/internal/home/types/internal.home.pricing.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalHomePricingApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<InternalHomePricingItem[]>> => {
  return apiClient.get<ApiResponse<InternalHomePricingItem[]>>(
    "/api/internal/pricing",
    { signal },
  );
};
