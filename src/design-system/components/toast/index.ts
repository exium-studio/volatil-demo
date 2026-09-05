// src/design-system/components/toast/index.ts

export { toast } from "@/design-system/components/toast/core/toast.manager";
export { toastEventBus } from "@/design-system/components/toast/core/toast.event-bus";
export {
  configureToast,
  getToastConfig,
  DEFAULT_TOAST_GROUP,
} from "@/design-system/components/toast/core/toast.config";

export { useToastHistory } from "@/design-system/components/toast/hooks/use-toast-history";
export {
  useVisibleToastGroups,
  useVisibleToastGroup,
} from "@/design-system/components/toast/hooks/use-visible-toasts";

export { Toaster } from "@/design-system/components/toast/ui/toaster";
export { NotificationCenter } from "@/design-system/components/toast/ui/notification-center";

<<<<<<< HEAD
export type {
  ToastOptions,
  ToastItemData,
  ToastVariant,
  ToastAction,
  DismissedReason,
  DuplicateStrategy,
  UpdateToastOptions,
  HistoryEntry,
  ToastEventMap,
  ToastEngineConfig,
  ToastPlacement,
} from "@/design-system/components/toast/types/toast.type";
=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
