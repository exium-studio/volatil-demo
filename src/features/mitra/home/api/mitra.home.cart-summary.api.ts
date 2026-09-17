// src/features/mitra/home/api/mitra.home.cart-summary.api.ts

import type { MitraHomeCartSummaryResponse } from "@/features/mitra/home/types/mitra.home.cart-summary.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraCartSummaryApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<MitraHomeCartSummaryResponse>> => {
  return apiClient.get<ApiResponse<MitraHomeCartSummaryResponse>>(
    "/api/mitra/home/cart-summary",
    { signal },
  );
};
