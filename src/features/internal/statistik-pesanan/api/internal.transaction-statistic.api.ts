// src/features/internal/statistik-pesanan/api/internal.transaction-statistic.api.ts

import type {
  InternalTransactionItem,
  InternalTransactionListResponse,
  InternalTransactionQueryParams,
  InternalTransactionStatistics,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalTransactionStatisticsApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<InternalTransactionStatistics>> => {
  return apiClient.get<ApiResponse<InternalTransactionStatistics>>(
    "/api/internal/transactions/statistics",
    { signal },
  );
};

export const fetchInternalTransactionsApi = async (
  params: InternalTransactionQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalTransactionListResponse>> => {
  return apiClient.get<ApiResponse<InternalTransactionListResponse>>(
    "/api/internal/transactions",
    {
      params,
      signal,
    },
  );
};

export const fetchInternalTransactionDetailApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalTransactionItem>> => {
  return apiClient.get<ApiResponse<InternalTransactionItem>>(
    `/api/internal/transactions/${id}`,
    { signal },
  );
};
