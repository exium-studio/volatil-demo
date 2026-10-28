// src/features/internal/statistik-pesanan/stores/internal.transaction-statistic.store.ts

import type { InternalTransactionStatisticFilterState } from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.wms.type";
import { create } from "zustand";

export const useInternalTransactionStatisticFilterStore =
  create<InternalTransactionStatisticFilterState>((set) => ({
    selectedOrderStatus: undefined,
    setSelectedOrderStatus: (status) =>
      set({ selectedOrderStatus: status }),
    toggleOrderStatus: (status) =>
      set((state) => ({
        selectedOrderStatus:
          state.selectedOrderStatus === status ? undefined : status,
      })),
    resetFilter: () => set({ selectedOrderStatus: undefined }),
  }));
