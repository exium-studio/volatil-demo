// src/features/mitra/help-center/services/mitra.transaction.service.ts

import { getMitraTransactionsApi } from "@/features/mitra/help-center/api/mitra.transaction.api";
import type { MitraTransactionItem } from "@/features/mitra/help-center/types/mitra.transaction.type";

export const mitraTransactionService = {
  getTransactions: async (signal?: AbortSignal): Promise<MitraTransactionItem[]> => {
    const response = await getMitraTransactionsApi(signal);
    return response.items;
  },
};
