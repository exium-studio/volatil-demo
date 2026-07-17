// src/design-system/components/toast/hooks/use-visible-toasts.ts

// [ARCHIVED] – previously used for grouped toast rendering (per-group stacks).
// Kept as reference if grouped view is ever reintroduced.

import { useToastVisibleStore } from "@/design-system/components/toast/stores/toast-visible.store";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import type { ToastRecord } from "@/design-system/components/toast/types/toast.types";

export type ToastGroupStack = {
  group: string;
  items: ToastRecord[];
};

function orderRecords(
  records: ToastRecord[],
  newestOnTop: boolean,
): ToastRecord[] {
  const sorted = [...records].sort((a, b) => a.createdAt - b.createdAt);
  return newestOnTop ? sorted.reverse() : sorted;
}

/** Returns every group as a ready-to-render stack. */
export function useVisibleToastGroups(): ToastGroupStack[] {
  const entries = useToastVisibleStore((state) => state.entries);
  const { newestOnTop } = getToastConfig();

  return Object.entries(entries).map(([group, records]) => ({
    group,
    items: orderRecords(records, newestOnTop),
  }));
}

/** Single-group variant, useful when a consumer only renders one known group. */
export function useVisibleToastGroup(group: string): ToastGroupStack {
  const records = useToastVisibleStore((state) => state.entries[group] ?? []);
  const { newestOnTop } = getToastConfig();
  return { group, items: orderRecords(records, newestOnTop) };
}
