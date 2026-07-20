// src/design-system/components/toast/core/toast.manager.ts

import type {
  DismissedReason,
  ToastOptions,
  ToastRecord,
  ToastVariant,
  UpdateToastOptions,
} from "@/design-system/components/toast/types/toast.types";
import { useToastVisibleStore } from "@/design-system/components/toast/stores/toast-visible.store";
import { useToastHistoryStore } from "@/design-system/components/toast/stores/toast-history.store";
import { toastEventBus } from "@/design-system/components/toast/core/toast.event-bus";
import { generateId } from "@/design-system/components/toast/utils/generate-id";
import {
  DEFAULT_TOAST_GROUP,
  getToastConfig,
} from "@/design-system/components/toast/core/toast.config";

// ---------------------------------------------------------------------------
// Timer scheduling. Kept as module-scoped state (not a store, not React) so
// timers survive re-renders/remounts without ever triggering one themselves.
// Every action here is idempotent — pausing an already-paused timer, or
// resuming a running one, is a safe no-op. This matters because UI events
// (hover, unmount) can fire in unexpected orders and must never leave a
// timer permanently stuck.
// ---------------------------------------------------------------------------

type TimerEntry = {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
  paused: boolean;
  onExpire: () => void;
};

const timers = new Map<string, TimerEntry>();
const leaveTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function startTimer(
  id: string,
  duration: number | null,
  onExpire: () => void,
): void {
  clearTimer(id);
  if (duration === null) return; // persistent toast, no timer needed

  const timeoutId = setTimeout(() => {
    timers.delete(id);
    onExpire();
  }, duration);

  timers.set(id, {
    timeoutId,
    remaining: duration,
    startedAt: Date.now(),
    paused: false,
    onExpire,
  });
}

function clearTimer(id: string): void {
  const entry = timers.get(id);
  if (!entry) return;
  clearTimeout(entry.timeoutId);
  timers.delete(id);
}

function pauseTimer(id: string): void {
  const entry = timers.get(id);
  if (!entry || entry.paused) return; // no active timer, or already paused — no-op

  clearTimeout(entry.timeoutId);
  const remaining = Math.max(
    entry.remaining - (Date.now() - entry.startedAt),
    0,
  );
  timers.set(id, { ...entry, remaining, paused: true });
  useToastVisibleStore
    .getState()
    .update(id, { paused: true, remainingDuration: remaining });
}

function resumeTimer(id: string): void {
  const entry = timers.get(id);
  if (!entry || !entry.paused) return; // no active timer, or already running — no-op

  const timeoutId = setTimeout(() => {
    timers.delete(id);
    entry.onExpire();
  }, entry.remaining);
  timers.set(id, { ...entry, timeoutId, startedAt: Date.now(), paused: false });
  useToastVisibleStore.getState().update(id, { paused: false });
}

/** Used by `use-page-visibility.ts` to freeze/unfreeze every timer when the tab is hidden. */
export function pauseAllTimers(): void {
  timers.forEach((_, id) => pauseTimer(id));
}

export function resumeAllTimers(): void {
  timers.forEach((_, id) => resumeTimer(id));
}

/**
 * Hover pause/resume — used by `toast-item.tsx`. Not part of the public
 * `toast` API. `resumeIfOrphaned` is a safety net: if a toast's DOM node
 * unmounts while paused (e.g. a parent stack toggling expand/collapse), the
 * browser never fires `pointerleave`, so without this the timer would stay
 * paused forever. Called from `toast-item.tsx`'s unmount cleanup.
 */
export const toastTimerControls = {
  pauseTimer,
  resumeTimer,
  pauseAll: pauseAllTimers,
  resumeAll: resumeAllTimers,
  resumeIfOrphaned: (id: string) => resumeTimer(id),
};

// ---------------------------------------------------------------------------
// Enter transition helper. Flips `status: "entering" -> "visible"` on the
// next paint so consumer CSS can define a real two-state enter transition
// (initial styles on "entering", target styles on "visible").
// ---------------------------------------------------------------------------

function nextFrame(callback: () => void): void {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => requestAnimationFrame(callback));
  } else {
    setTimeout(callback, 16);
  }
}

// ---------------------------------------------------------------------------
// History wiring. Direct calls, no event-bus indirection — history isn't a
// pluggable extension, it's a first-class part of what "showing a toast" means.
// ---------------------------------------------------------------------------

function nextHistoryVersion(toastId: string): number {
  const versions = useToastHistoryStore
    .getState()
    .getAll({ includeDeleted: true })
    .filter((entry) => entry.toastId === toastId)
    .map((entry) => entry.version);
  return versions.length === 0 ? 1 : Math.max(...versions) + 1;
}

function recordHistorySnapshot(
  record: ToastRecord,
  source: "create" | "update",
): void {
  useToastHistoryStore.getState().add({
    historyEntryId: generateId("hist"),
    toastId: record.id,
    version: nextHistoryVersion(record.id),
    group: record.group,
    variant: record.variant,
    title: record.title,
    description: record.description,
    icon: record.icon,
    actions: record.actions,
    metadata: record.metadata,
    source,
    createdAt: Date.now(),
    closedAt: null,
    expiresAt: record.duration === null ? null : Date.now() + record.duration,
    read: false,
    dismissedReason: null,
    isUpdate: source === "update",
    deletedFromHistory: false,
  });
}

function annotateHistoryOnClose(
  toastId: string,
  reason: DismissedReason,
): void {
  const entries = useToastHistoryStore
    .getState()
    .getAll({ includeDeleted: true });
  const latest = entries
    .filter((entry) => entry.toastId === toastId)
    .sort((a, b) => b.version - a.version)[0];
  if (!latest) return;

  useToastHistoryStore.setState((state) => ({
    entries: state.entries.map((entry) =>
      entry.historyEntryId === latest.historyEntryId
        ? { ...entry, closedAt: Date.now(), dismissedReason: reason }
        : entry,
    ),
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function resolveDuration(duration: ToastOptions["duration"]): number | null {
  if (duration === undefined) return getToastConfig().defaultDuration;
  return duration; // explicit `null` (persistent) or explicit number both pass through
}

function buildRecord(options: ToastOptions, id: string): ToastRecord {
  const duration = resolveDuration(options.duration);
  const now = Date.now();
  return {
    ...options,
    id,
    group: options.group ?? DEFAULT_TOAST_GROUP,
    variant: options.variant ?? "info",
    duration,
    status: "entering",
    createdAt: now,
    updatedAt: now,
    remainingDuration: duration,
    paused: false,
    isDeletedFromHistory: false,
  };
}

/** Marks a toast "leaving" and schedules its actual removal after `leaveAnimationDuration`. */
function beginClose(record: ToastRecord, reason: DismissedReason): void {
  toastEventBus.emit("close", { record, reason });
  annotateHistoryOnClose(record.id, reason);
  record.onClose?.(record, reason);
  useToastVisibleStore.getState().update(record.id, { status: "leaving" });

  const { leaveAnimationDuration } = getToastConfig();
  const timeoutId = setTimeout(() => {
    leaveTimeouts.delete(record.id);
    remove(record.id);
  }, leaveAnimationDuration);
  leaveTimeouts.set(record.id, timeoutId);
}

function handleExpire(id: string): void {
  const record = useToastVisibleStore.getState().find(id);
  if (!record) return;

  toastEventBus.emit("expire", record);
  record.onExpire?.(record);
  beginClose(record, "timeout");
}

function create(options: ToastOptions = {}): string {
  const strategy =
    options.duplicateStrategy ?? getToastConfig().duplicateStrategy;
  const requestedId = options.id;

  if (requestedId && useToastVisibleStore.getState().find(requestedId)) {
    if (strategy === "ignore") return requestedId;
    if (strategy === "throw") {
      throw new Error(
        `[toast] duplicate id "${requestedId}" with duplicateStrategy="throw"`,
      );
    }
    // "replace": this is an instant swap in the same tick, not a user-initiated
    // dismiss — hard-remove immediately rather than going through the animated
    // close flow, otherwise both the old and new record would briefly coexist
    // under the same id.
    remove(requestedId);
  }

  const id = requestedId ?? generateId();
  const record = buildRecord(options, id);

  useToastVisibleStore.getState().add(record);
  startTimer(id, record.duration, () => handleExpire(id));
  recordHistorySnapshot(record, "create");

  toastEventBus.emit("show", record);
  record.onShow?.(record);

  nextFrame(() => {
    // Only flip if still present — it may have already been closed/removed synchronously.
    if (useToastVisibleStore.getState().find(id)) {
      useToastVisibleStore.getState().update(id, { status: "visible" });
    }
  });

  return id;
}

function update(id: string, patch: UpdateToastOptions): void {
  const existing = useToastVisibleStore.getState().find(id);
  if (!existing) return;

  const duration =
    patch.duration !== undefined ? patch.duration : existing.duration;
  const nextRecord: ToastRecord = {
    ...existing,
    ...patch,
    id: existing.id,
    group: existing.group,
    duration,
    remainingDuration: duration,
    updatedAt: Date.now(),
  };

  useToastVisibleStore.getState().update(id, nextRecord);
  startTimer(id, duration, () => handleExpire(id)); // restart timer with the (possibly new) duration
  recordHistorySnapshot(nextRecord, "update");

  toastEventBus.emit("update", nextRecord);
  nextRecord.onUpdate?.(nextRecord);
}

function close(id: string, reason: DismissedReason = "manual"): void {
  const record = useToastVisibleStore.getState().find(id);
  if (!record || record.status === "leaving") return; // already closing — avoid double-scheduling removal

  clearTimer(id);
  beginClose(record, reason);
}

/** Hard removal — used internally after the leave animation window, and available for immediate/no-animation removal. */
function remove(id: string): void {
  const pendingLeave = leaveTimeouts.get(id);
  if (pendingLeave) {
    clearTimeout(pendingLeave);
    leaveTimeouts.delete(id);
  }

  const record = useToastVisibleStore.getState().find(id);
  clearTimer(id);
  useToastVisibleStore.getState().remove(id);
  if (record) {
    toastEventBus.emit("remove", { id });
    record.onRemove?.(record);
  }
}

function closeAll(): void {
  Object.values(useToastVisibleStore.getState().entries)
    .flat()
    .forEach((record) => close(record.id, "closeAll"));
}

function removeAll(): void {
  const all = Object.values(useToastVisibleStore.getState().entries).flat();
  all.forEach((record) => remove(record.id));
}

function exists(id: string): boolean {
  return Boolean(useToastVisibleStore.getState().find(id));
}

function isVisible(id: string): boolean {
  const record = useToastVisibleStore.getState().find(id);
  return record?.status === "visible" || record?.status === "entering";
}

function withVariant(variant: ToastVariant) {
  return (title: ToastOptions["title"], options: ToastOptions = {}) =>
    create({ ...options, title, variant });
}

export const toast = {
  create,
  update,
  close,
  remove,
  closeAll,
  removeAll,
  exists,
  isVisible,
  success: withVariant("success"),
  error: withVariant("error"),
  warning: withVariant("warning"),
  info: withVariant("info"),
  loading: withVariant("loading"),
  custom: (
    renderer: NonNullable<ToastOptions["renderer"]>,
    options: ToastOptions = {},
  ) => create({ ...options, variant: "custom", renderer }),
};
