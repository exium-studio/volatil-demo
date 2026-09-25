// src\design-system\components\toast\stores\toast-history.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import { useToastVisibleStore } from "@/design-system/components/toast/stores/toast-visible.store";
import type {
  HistoryEntry,
  HistoryStore,
} from "@/design-system/components/toast/types/toast.type";

export function isExpired(entry: HistoryEntry, ttl: number | null): boolean {
  if (ttl === null) return false;
  return Date.now() - entry.createdAt > ttl;
}

/**
 * History and visible-toast are intentionally separate stores/arrays, but
 * deleting a history entry still needs to flag the still-visible toast (if
 * any) as "removed from history" — this is the one place the two stores talk
 * to each other, kept local to this file rather than a separate module.
 */
function syncDeletedFlagToVisibleToast(toastId: string): void {
  if (useToastVisibleStore.getState().find(toastId)) {
    useToastVisibleStore.getState().markDeletedFromHistory(toastId);
  }
}

export const useToastHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      entries: [],

      add: (entry) =>
        set((state) => {
          const { historyLimit, historyTTL } = getToastConfig();
          const notExpired = state.entries.filter(
            (item) => !isExpired(item, historyTTL),
          );
          const next = [...notExpired, entry];
          return {
            entries:
              next.length > historyLimit
                ? next.slice(next.length - historyLimit)
                : next,
          };
        }),

      markRead: (historyEntryId) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.historyEntryId === historyEntryId
              ? { ...entry, read: true }
              : entry,
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          entries: state.entries.map((entry) => ({ ...entry, read: true })),
        })),

      deleteOne: (historyEntryId) => {
        const entry = get().entries.find(
          (item) => item.historyEntryId === historyEntryId,
        );
        set((state) => ({
          entries: state.entries.map((item) =>
            item.historyEntryId === historyEntryId
              ? { ...item, deletedFromHistory: true }
              : item,
          ),
        }));
        if (entry) syncDeletedFlagToVisibleToast(entry.toastId);
      },

      deleteMany: (historyEntryIds) => {
        const idSet = new Set(historyEntryIds);
        const toastIds = new Set(
          get()
            .entries.filter((entry) => idSet.has(entry.historyEntryId))
            .map((entry) => entry.toastId),
        );
        set((state) => ({
          entries: state.entries.map((entry) =>
            idSet.has(entry.historyEntryId)
              ? { ...entry, deletedFromHistory: true }
              : entry,
          ),
        }));
        toastIds.forEach(syncDeletedFlagToVisibleToast);
      },

      clear: () => {
        const toastIds = new Set(get().entries.map((entry) => entry.toastId));
        set({ entries: [] });
        toastIds.forEach(syncDeletedFlagToVisibleToast);
      },

      getAll: (options) => {
        const { historyTTL } = getToastConfig();
        const state = get();
        const notExpired = state.entries.filter(
          (entry) => !isExpired(entry, historyTTL),
        );

        return options?.includeDeleted
          ? notExpired
          : notExpired.filter((entry) => !entry.deletedFromHistory);
      },
    }),
    {
      name: getToastConfig().historyStorageKey,
      version: 1,
      partialize: (state) => ({
        entries: state.entries.filter(
          (entry) => !isExpired(entry, getToastConfig().historyTTL),
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const { historyTTL } = getToastConfig();
        const notExpired = state.entries.filter(
          (entry) => !isExpired(entry, historyTTL),
        );
        if (notExpired.length !== state.entries.length) {
          state.entries = notExpired;
        }
      },
    },
  ),
);
