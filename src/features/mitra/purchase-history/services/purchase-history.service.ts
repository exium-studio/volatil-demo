// src/features/mitra/purchase-history/services/purchase-history.service.ts

import { fetchPurchaseHistoryApi } from "@/features/mitra/purchase-history/api/purchase-history.api";
import type {
  PurchaseHistoryQueryParams,
  PurchaseHistoryResponse,
  TransactionRecord,
} from "@/features/mitra/purchase-history/types/purchase-history.type";
import { DUMMY_PURCHASE_HISTORY } from "@/shared/constants/dummy-data/dummy-purchase-history";
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

export const getPaginatedPurchaseHistory = (
  items: TransactionRecord[],
  params: PurchaseHistoryQueryParams,
): PurchaseHistoryResponse => {
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

const EMPTY_PURCHASE_HISTORY_RESPONSE: PurchaseHistoryResponse = {
  items: [],
  pagination: createPaginationMeta(1, 10, 0),
};

export const getPurchaseHistory = async (
  params: PurchaseHistoryQueryParams,
  signal?: AbortSignal,
): Promise<PurchaseHistoryResponse> => {
  try {
    const response = await fetchPurchaseHistoryApi(params, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? getPaginatedPurchaseHistory(DUMMY_PURCHASE_HISTORY, params)
      : EMPTY_PURCHASE_HISTORY_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "getPurchaseHistory API error, falling back to dummy data:",
        error,
      );
      return getPaginatedPurchaseHistory(DUMMY_PURCHASE_HISTORY, params);
    }
    throw error;
  }
};
