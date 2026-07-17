// src/design-system/components/toast/types/toast.types.ts

import type { CenterProps } from "@/design-system/components/layout/types/center.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "custom";

export type ToastStatus = "entering" | "visible" | "leaving";

export type DuplicateStrategy = "replace" | "ignore" | "throw";

export type DismissedReason =
  | "timeout"
  | "manual"
  | "closeAll"
  | "replaced"
  | "unknown";

export type ToastIconProps = CenterProps & {
  record: ToastRecord;
  icon?: ReactNode;
};

export type ToastVariantMap = Record<
  ToastRecord["variant"],
  {
    icon: React.ReactNode;
    bg: string;
    color: string;
  }
>;

export type ToastAction = {
  content: ReactNode;
  onClick: (id: string) => void;
};

export type ToastRenderItemParams<TItem> = {
  item: TItem;
  index: number;
  stackExpanded?: boolean;
};

export type ToastStackProps<TItem> = {
  groupLabel: string;
  items: TItem[];
  getId: (item: TItem) => string;
  maxVisible: number;
  renderItem: (params: ToastRenderItemParams<TItem>) => ReactNode;
  isItemLeaving?: (item: TItem) => boolean;
  onCloseAll?: () => void;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
};

export type ToastItemProps = StackProps & {
  record: ToastRecord;
  index: number;
  expanded?: boolean;
};

export type ToastRenderer = (record: ToastRecord) => ReactNode;

export type ToastLifecycleHandlers = {
  onShow?: (record: ToastRecord) => void;
  onUpdate?: (record: ToastRecord) => void;
  onClose?: (record: ToastRecord, reason: DismissedReason) => void;
  onRemove?: (record: ToastRecord) => void;
  onExpire?: (record: ToastRecord) => void;
};

export type ToastOptions = ToastLifecycleHandlers & {
  id?: string;
  group?: string;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ToastAction[];
  quickAction?: ToastAction;
  metadata?: Record<string, unknown>;
  duration?: number | null; // ms. `null` = persistent (never auto-dismiss). Defaults from config.
  duplicateStrategy?: DuplicateStrategy;
  renderer?: ToastRenderer;
};

export type ToastRecord = Omit<ToastOptions, "group" | "duration"> & {
  id: string;
  group: string;
  variant: ToastVariant;
  duration: number | null;
  status: ToastStatus;
  createdAt: number;
  updatedAt: number;
  remainingDuration: number | null;
  paused: boolean;
  isDeletedFromHistory: boolean;
};

export type UpdateToastOptions = Omit<ToastOptions, "id" | "group">;

export type HistoryEntry = {
  /** Unique per snapshot. Never reused, never mutated after creation. */
  historyEntryId: string;
  /** Links back to the originating toast; many entries can share this. */
  toastId: string;
  /** Increments per `toastId`, starting at 1 on the initial `create()`. */
  version: number;
  group: string;
  variant: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ToastAction[];
  metadata?: Record<string, unknown>;
  source: "create" | "update";
  createdAt: number;
  closedAt: number | null;
  expiresAt: number | null;
  read: boolean;
  dismissedReason: DismissedReason | null;
  isUpdate: boolean;
  /** Soft-delete flag. Entry stays for audit purposes; UI decides whether to hide it. */
  deletedFromHistory: boolean;
};

export type StoredHistoryShape = {
  version: number;
  entries: HistoryEntry[];
};

export type ToastEventMap = {
  show: ToastRecord;
  update: ToastRecord;
  close: { record: ToastRecord; reason: DismissedReason };
  remove: { id: string };
  expire: ToastRecord;
};

export type ToastEventName = keyof ToastEventMap;

export type ToastEventListener<TEvent extends ToastEventName> = (
  payload: ToastEventMap[TEvent],
) => void;

export type ToastPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end";

export type ToastEngineConfig = {
  /** Default auto-dismiss duration in ms. */
  defaultDuration: number | null;
  /** Max toasts rendered "on top" per group before the rest collapse into the stack. */
  maxVisiblePerGroup: number;
  /** Newest toast rendered above or below older ones within a group. */
  newestOnTop: boolean;
  duplicateStrategy: "replace" | "ignore" | "throw";
  historyStorageKey: string;
  /** Max entries kept in history before oldest are pruned. */
  historyLimit: number;
  /** Time-to-live for a history entry, in ms. `null` = never expires. */
  historyTTL: number | null;
  /** Whether toast-item renders a "removed from history" indicator by default. */
  showDeletedFromHistoryIndicator: boolean;
  /**
   * How long (ms) a toast stays in `status: "leaving"` before it's actually
   * removed from the store. Match this to your own CSS exit-transition
   * duration — if your transition is longer than this, the toast will pop
   * out abruptly instead of finishing the animation.
   */
  leaveAnimationDuration: number;
  /** Where the `<Toaster />` renders on screen. */
  placement: ToastPlacement;
  showProgressBar: boolean;
};
