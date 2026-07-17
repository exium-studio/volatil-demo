// src/design-system/components/toast/stores/toast-history.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryEntry } from "@/design-system/components/toast/types/toast.types";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import { useToastVisibleStore } from "@/design-system/components/toast/stores/toast-visible.store";

type HistoryState = {
  entries: HistoryEntry[];
};

type HistoryActions = {
  add: (entry: HistoryEntry) => void;
  markRead: (historyEntryId: string) => void;
  markAllRead: () => void;
  /** Soft-deletes one entry and flags the still-visible toast (if any) as removed-from-history. */
  deleteOne: (historyEntryId: string) => void;
  deleteMany: (historyEntryIds: string[]) => void;
  clear: () => void;
  /**
   * Filters expired + soft-deleted entries out AND prunes expired ones from
   * state (lazy delete on read). Pass `{ includeDeleted: true }` for audit views.
   */
  getAll: (options?: { includeDeleted?: boolean }) => HistoryEntry[];
};

export type HistoryStore = HistoryState & HistoryActions;

function isExpired(entry: HistoryEntry, ttl: number | null): boolean {
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
          const { historyLimit } = getToastConfig();
          const next = [...state.entries, entry];
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

        if (notExpired.length !== state.entries.length)
          set({ entries: notExpired });

        return options?.includeDeleted
          ? notExpired
          : notExpired.filter((entry) => !entry.deletedFromHistory);
      },
    }),
    {
      name: getToastConfig().historyStorageKey,
      version: 1,
      // Add a case here whenever the persisted shape changes in a future version:
      // migrate: (persisted, version) => { if (version === 0) { ... } return persisted as HistoryState; },
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
