// src/features/mitra/transaction-history/api/transaction-history.api.ts

import type {
  TransactionHistoryQueryParams,
  TransactionHistoryResponse,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchTransactionHistoryApi = async (
  params: TransactionHistoryQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<TransactionHistoryResponse>> => {
  return apiClient.get<ApiResponse<TransactionHistoryResponse>>(
    "/mitra/transaction-history",
    {
      params,
      signal,
    },
  );
};
