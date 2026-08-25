// src/features/mitra/purchase-history/api/purchase-history.api.ts

import type {
  PurchaseHistoryQueryParams,
  PurchaseHistoryResponse,
} from "@/features/mitra/purchase-history/types/purchase-history.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchPurchaseHistoryApi = async (
  params: PurchaseHistoryQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PurchaseHistoryResponse>> => {
  return apiClient.get<ApiResponse<PurchaseHistoryResponse>>(
    "/mitra/purchase-history",
    {
      params,
      signal,
    },
  );
};
