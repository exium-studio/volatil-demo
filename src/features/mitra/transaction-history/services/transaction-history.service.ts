// src/features/mitra/transaction-history/services/transaction-history.service.ts

import { fetchTransactionHistoryApi } from "@/features/mitra/transaction-history/api/transaction-history.api";
import type {
  TransactionHistoryQueryParams,
  TransactionHistoryResponse,
  TransactionRecord,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { DUMMY_TRANSACTION_HISTORY } from "@/shared/constants/dummy-data/dummy-transaction-history";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const matchesSearch = (item: TransactionRecord, search: string) =>
  [
    item.transactionNumber,
    item.orderNumber,
    item.billingCode,
    item.paymentMethod,
    ...item.items.map((i) => i.sourceLayerTitle),
    ...item.items.map((i) => i.sourceLayerId),
  ].some((value) => value?.toLowerCase().includes(search));

export const getPaginatedTransactionHistory = (
  items: TransactionRecord[],
  params: TransactionHistoryQueryParams,
): TransactionHistoryResponse => {
  const search = params.search?.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesStatus = !params.status || item.transactionStatus === params.status;
    const matchesQuery = !search || matchesSearch(item, search);
    return matchesStatus && matchesQuery;
  });

  const startIndex = (params.page - 1) * params.pageSize;

  return {
    items: filteredItems.slice(startIndex, startIndex + params.pageSize),
    pagination: createPaginationMeta(
      params.page,
      params.pageSize,
      filteredItems.length,
    ),
  };
};

const EMPTY_TRANSACTION_HISTORY_RESPONSE: TransactionHistoryResponse = {
  items: [],
  pagination: createPaginationMeta(1, 10, 0),
};

export const getTransactionHistory = async (
  params: TransactionHistoryQueryParams,
  signal?: AbortSignal,
): Promise<TransactionHistoryResponse> => {
  try {
    const response = await fetchTransactionHistoryApi(params, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? getPaginatedTransactionHistory(DUMMY_TRANSACTION_HISTORY, params)
      : EMPTY_TRANSACTION_HISTORY_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "getTransactionHistory API error, falling back to dummy data:",
        error,
      );
      return getPaginatedTransactionHistory(DUMMY_TRANSACTION_HISTORY, params);
    }
    throw error;
  }
};
