// src/design-system/components/toast/hooks/use-toast-history.ts

import { useMemo } from "react";
import { useToastHistoryStore } from "@/design-system/components/toast/stores/toast-history.store";
import type { HistoryEntry } from "@/design-system/components/toast/types/toast.types";

export type HistoryGroupStack = {
  group: string;
  entries: HistoryEntry[];
};

export function useToastHistory() {
  // Subscribing to `entries` keeps this reactive; `getAll()` (not the raw
  // field) is applied below to respect TTL + soft-delete filtering.
  useToastHistoryStore((state) => state.entries);
  const all = useToastHistoryStore.getState().getAll();

  const groups: HistoryGroupStack[] = useMemo(() => {
    const byGroup = new Map<string, HistoryEntry[]>();
    for (const entry of all) {
      const list = byGroup.get(entry.group) ?? [];
      list.push(entry);
      byGroup.set(entry.group, list);
    }
    return Array.from(byGroup.entries()).map(([group, entries]) => ({
      group,
      entries: entries.sort((a, b) => b.createdAt - a.createdAt),
    }));
  }, [all]);

  const { deleteOne, deleteMany, clear, markRead, markAllRead } =
    useToastHistoryStore.getState();

  return { groups, all, deleteOne, deleteMany, clear, markRead, markAllRead };
}
