// src/features/help-center/services/mitra.transaction.service.ts

import { getMitraTransactionsApi } from "@/features/help-center/api/mitra.transaction.api";
import type { MitraTransactionItem } from "@/features/help-center/types/mitra.transaction.type";
import { DUMMY_MITRA_TRANSACTIONS } from "@/shared/constants/dummy-data/dummy-mitra-transactions";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const mitraTransactionService = {
  getTransactions: async (
    signal?: AbortSignal,
  ): Promise<MitraTransactionItem[]> => {
    try {
      const response = await getMitraTransactionsApi(signal);
      if (response.items && response.items.length > 0) {
        return response.items;
      }
      return isDummyDataEnabled() ? DUMMY_MITRA_TRANSACTIONS : response.items;
    } catch (error) {
      if (isDummyDataEnabled()) {
        console.warn(
          "getMitraTransactionsApi error, falling back to dummy data:",
          error,
        );
        return DUMMY_MITRA_TRANSACTIONS;
      }
      throw error;
    }
  },
};
