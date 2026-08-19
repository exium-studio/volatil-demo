// src/features/mitra/help-center/api/mitra.transaction.api.ts

import type { MitraTransactionListResponse } from "@/features/mitra/help-center/types/mitra.transaction.type";
import { DUMMY_MITRA_TRANSACTIONS } from "@/shared/constants/dummy-data/dummy-mitra-transactions";

export const getMitraTransactionsApi = async (
  _signal?: AbortSignal,
): Promise<MitraTransactionListResponse> => {
  // Simulated API call returning dummy transaction list
  return {
    items: DUMMY_MITRA_TRANSACTIONS,
    total: DUMMY_MITRA_TRANSACTIONS.length,
  };
};
