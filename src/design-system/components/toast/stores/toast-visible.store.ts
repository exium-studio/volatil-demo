// src/design-system/components/toast/stores/toast-visible.store.ts

import { create } from "zustand";
import type { ToastRecord } from "@/design-system/components/toast/types/toast.types";

type VisibleToastState = {
  /** group -> toasts belonging to that group, items by `createdAt` ascending. */
  entries: Record<string, ToastRecord[]>;
};

type VisibleToastActions = {
  add: (record: ToastRecord) => void;
  update: (id: string, patch: Partial<ToastRecord>) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  markDeletedFromHistory: (toastId: string) => void;
  find: (id: string) => ToastRecord | undefined;
};

export type VisibleToastStore = VisibleToastState & VisibleToastActions;

export const useToastVisibleStore = create<VisibleToastStore>((set, get) => ({
  entries: {},

  add: (record) =>
    set((state) => {
      const group = state.entries[record.group] ?? [];
      return {
        entries: { ...state.entries, [record.group]: [...group, record] },
      };
    }),

  update: (id, patch) =>
    set((state) => {
      const next: Record<string, ToastRecord[]> = {};
      for (const [group, records] of Object.entries(state.entries)) {
        next[group] = records.map((record) =>
          record.id === id ? { ...record, ...patch } : record,
        );
      }
      return { entries: next };
    }),

  remove: (id) =>
    set((state) => {
      const next: Record<string, ToastRecord[]> = {};
      for (const [group, records] of Object.entries(state.entries)) {
        const filtered = records.filter((record) => record.id !== id);
        if (filtered.length > 0) next[group] = filtered;
      }
      return { entries: next };
    }),

  removeAll: () => set({ entries: {} }),

  markDeletedFromHistory: (toastId) =>
    set((state) => {
      const next: Record<string, ToastRecord[]> = {};
      for (const [group, records] of Object.entries(state.entries)) {
        next[group] = records.map((record) =>
          record.id === toastId
            ? { ...record, isDeletedFromHistory: true }
            : record,
        );
      }
      return { entries: next };
    }),

  find: (id) => {
    for (const records of Object.values(get().entries)) {
      const found = records.find((record) => record.id === id);
      if (found) return found;
    }
    return undefined;
  },
}));
