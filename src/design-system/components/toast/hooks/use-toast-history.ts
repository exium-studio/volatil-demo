// src\design-system\components\toast\hooks\use-toast-history.ts

// src\design-system\components\toast\hooks\use-toast-history.ts

import { useMemo } from "react";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import {
  isExpired,
  useToastHistoryStore,
} from "@/design-system/components/toast/stores/toast-history.store";
import type {
  HistoryEntry,
  HistoryGroupStack,
} from "@/design-system/components/toast/types/toast.type";

export function useToastHistory() {
  // Subscribe to entries for reactivity
  const entries = useToastHistoryStore((state) => state.entries);
  const { historyTTL } = getToastConfig();

  // Filter out expired and soft-deleted items reactively
  const all = useMemo(() => {
    return entries.filter(
      (entry) => !isExpired(entry, historyTTL) && !entry.deletedFromHistory,
    );
  }, [entries, historyTTL]);

  const groups: HistoryGroupStack[] = useMemo(() => {
    const byGroup = new Map<string, HistoryEntry[]>();
    for (const entry of all) {
      const list = byGroup.get(entry.group) ?? [];
      list.push(entry);
      byGroup.set(entry.group, list);
    }
    return Array.from(byGroup.entries()).map(([group, groupEntries]) => ({
      group,
      entries: groupEntries.sort((a, b) => b.createdAt - a.createdAt),
    }));
  }, [all]);

  const { deleteOne, deleteMany, clear, markRead, markAllRead } =
    useToastHistoryStore.getState();

  return { groups, all, deleteOne, deleteMany, clear, markRead, markAllRead };
}
