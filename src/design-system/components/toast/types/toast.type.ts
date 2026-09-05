// src/design-system/components/toast/types/toast.type.ts

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
  toast: ToastItemData;
  icon?: ReactNode;
};

export type ToastVariantMap = Record<
  ToastItemData["variant"],
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
  setStackExpanded?: (expanded: boolean) => void;
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
  toast: ToastItemData;
  index: number;
  expanded?: boolean;
  showTimestamp?: boolean;
};

export type ToastRenderer = (toast: ToastItemData) => ReactNode;

export type ToastLifecycleHandlers = {
  onShow?: (toast: ToastItemData) => void;
  onUpdate?: (toast: ToastItemData) => void;
  onClose?: (toast: ToastItemData, reason: DismissedReason) => void;
  onRemove?: (toast: ToastItemData) => void;
  onExpire?: (toast: ToastItemData) => void;
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

export type ToastItemData = Omit<ToastOptions, "group" | "duration"> & {
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
  show: ToastItemData;
  update: ToastItemData;
  close: { record: ToastItemData; reason: DismissedReason };
  remove: { id: string };
  expire: ToastItemData;
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
