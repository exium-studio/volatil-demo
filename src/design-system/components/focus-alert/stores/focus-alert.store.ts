// src/design-system/components/focus-alert/stores/focus-alert.store.ts

import { create } from "zustand";
import type { FocusAlertRenderFn } from "@/design-system/components/focus-alert/types/focus-alert.type";

type FocusAlertEntry = {
  key: string;
  render: FocusAlertRenderFn;
};

type FocusAlerterStore = {
  alerts: FocusAlertEntry[];
  open: (key: string, render: FocusAlertRenderFn) => void;
  close: (key: string) => void;
};

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
