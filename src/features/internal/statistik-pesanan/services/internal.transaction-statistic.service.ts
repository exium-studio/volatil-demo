// src/features/internal/statistik-pesanan/services/internal.transaction-statistic.service.ts

import {
  fetchInternalTransactionDetailApi,
  fetchInternalTransactionsApi,
  fetchInternalTransactionStatisticsApi,
} from "@/features/internal/statistik-pesanan/api/internal.transaction-statistic.api";
import type {
  InternalTransactionItem,
  InternalTransactionListResponse,
  InternalTransactionQueryParams,
  InternalTransactionStatistics,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import {
  DUMMY_INTERNAL_TRANSACTIONS,
  DUMMY_INTERNAL_TRANSACTION_STATISTICS,
} from "@/shared/constants/dummy-data/dummy-internal-transactions";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const getInternalTransactionStatistics = async (
  signal?: AbortSignal,
): Promise<InternalTransactionStatistics> => {
  try {
    const response = await fetchInternalTransactionStatisticsApi(signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? DUMMY_INTERNAL_TRANSACTION_STATISTICS
      : { activeOrders: 0, settledTransactions: 0, netWorth: 0 };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return DUMMY_INTERNAL_TRANSACTION_STATISTICS;
    }
    throw error;
  }
};

const matchesSearch = (item: InternalTransactionItem, search: string) =>
  [
    item.transactionNumber,
    item.orderNumber,
    item.billingCode,
    item.paymentMethod,
    item.mitra.name,
    item.mitra.email,
    item.mitra.agencyOrCompany,
    ...item.items.map((i) => i.sourceLayerTitle),
    ...item.items.map((i) => i.sourceLayerId),
  ].some((value) => value?.toLowerCase().includes(search));

export const getPaginatedInternalTransactions = (
  items: InternalTransactionItem[],
  params: InternalTransactionQueryParams,
): InternalTransactionListResponse => {
  const search = params.search?.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesTxStatus =
      !params.transactionStatus ||
      item.transactionStatus === params.transactionStatus;
    const matchesOrdStatus =
      !params.orderStatus || item.orderStatus === params.orderStatus;
    const matchesSelectionType =
      !params.selectionType || item.selectionType === params.selectionType;
    const matchesQuery = !search || matchesSearch(item, search);
    return (
      matchesTxStatus &&
      matchesOrdStatus &&
      matchesSelectionType &&
      matchesQuery
    );
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

const EMPTY_RESPONSE: InternalTransactionListResponse = {
  items: [],
  pagination: createPaginationMeta(1, 10, 0),
};

export const getInternalTransactions = async (
  params: InternalTransactionQueryParams,
  signal?: AbortSignal,
): Promise<InternalTransactionListResponse> => {
  try {
    const response = await fetchInternalTransactionsApi(params, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? getPaginatedInternalTransactions(DUMMY_INTERNAL_TRANSACTIONS, params)
      : EMPTY_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getPaginatedInternalTransactions(DUMMY_INTERNAL_TRANSACTIONS, params);
    }
    throw error;
  }
};

export const getInternalTransactionDetail = async (
  id: string,
  signal?: AbortSignal,
): Promise<InternalTransactionItem | null> => {
  try {
    const response = await fetchInternalTransactionDetailApi(id, signal);
    if (response.data) {
      return response.data;
    }
    const found = DUMMY_INTERNAL_TRANSACTIONS.find((t) => t.id === id);
    return found ?? null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      const found = DUMMY_INTERNAL_TRANSACTIONS.find((t) => t.id === id);
      return found ?? null;
    }
    throw error;
  }
};
