// src/design-system/components/focus-alert/stores/focus-alert.store.ts

import { create } from "zustand";
import type { FocusAlerterStore } from "@/design-system/components/focus-alert/types/focus-alert.type";

export const useFocusAlerterStore = create<FocusAlerterStore>((set) => ({
  alerts: [],
  open: (key, render) =>
    set((state) => ({
      alerts: [...state.alerts.filter((a) => a.key !== key), { key, render }],
    })),
  close: (key) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.key !== key),
    })),
}));
