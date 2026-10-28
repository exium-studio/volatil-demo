// src/features/help-center/api/mitra.transaction.api.ts

import type { MitraTransactionListResponse } from "@/features/help-center/types/mitra.transaction.type";
import type { TransactionRecord } from "@/features/mitra/transaction-history/types/transaction-history.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type { OrderStatus } from "@/shared/types/status.type";

export const getMitraTransactionsApi = async (
  signal?: AbortSignal,
): Promise<MitraTransactionListResponse> => {
  const response = await apiClient.get<
    ApiResponse<{
      items: TransactionRecord[];
      pagination?: { totalItems: number };
    }>
  >("/api/mitra/transaction-history", {
    params: { page: 1, pageSize: 100 },
    signal,
  });

  const records = response.data?.items ?? [];
  const items = records.map((rec) => ({
    id: rec.id || rec.orderId,
    orderNumber: rec.orderNumber || rec.transactionNumber,
    billingCode: rec.billingCode,
    status:
      rec.orderStatus ??
      (rec.transactionStatus as unknown as OrderStatus) ??
      "pending_payment",
    totalPrice: rec.totalAmount,
    orderedAt: rec.createdAt,
    items: (rec.items ?? []).map((it) => ({
      id: it.id,
      sourceLayerId: it.sourceLayerId,
      sourceLayerTitle: it.sourceLayerTitle,
    })),
  }));

  return {
    items,
    total: response.data?.pagination?.totalItems ?? items.length,
  };
};
