// src/design-system/components/toast/stores/toast-visible.store.ts

import type {
  ToastItemData,
  VisibleToastStore,
} from "@/design-system/components/toast/types/toast.type";
import { create } from "zustand";

export const useToastVisibleStore = create<VisibleToastStore>((set, get) => ({
  entries: {},

  add: (toast) =>
    set((state) => {
      const group = state.entries[toast.group] ?? [];
      return {
        entries: { ...state.entries, [toast.group]: [...group, toast] },
      };
    }),

  update: (id, patch) =>
    set((state) => {
      const next: Record<string, ToastItemData[]> = {};
      for (const [group, toasts] of Object.entries(state.entries)) {
        next[group] = toasts.map((toast) =>
          toast.id === id ? { ...toast, ...patch } : toast,
        );
      }
      return { entries: next };
    }),

  remove: (id) =>
    set((state) => {
      const next: Record<string, ToastItemData[]> = {};
      for (const [group, toasts] of Object.entries(state.entries)) {
        const filtered = toasts.filter((toast) => toast.id !== id);
        if (filtered.length > 0) next[group] = filtered;
      }
      return { entries: next };
    }),

  removeAll: () => set({ entries: {} }),

  markDeletedFromHistory: (toastId) =>
    set((state) => {
      const next: Record<string, ToastItemData[]> = {};
      for (const [group, toasts] of Object.entries(state.entries)) {
        next[group] = toasts.map((toast) =>
          toast.id === toastId
            ? { ...toast, isDeletedFromHistory: true }
            : toast,
        );
      }
      return { entries: next };
    }),

  find: (id) => {
    for (const toasts of Object.values(get().entries)) {
      const match = toasts.find((toast) => toast.id === id);
      if (match) return match;
    }
    return undefined;
  },
}));
