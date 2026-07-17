// src/design-system/components/toast/core/toast.config.ts

import type { ToastEngineConfig } from "@/design-system/components/toast/types/toast.types";

export const DEFAULT_TOAST_GROUP = "Default";

const DEFAULT_TOAST_CONFIG: ToastEngineConfig = {
  defaultDuration: 5000,
  // defaultDuration: null,
  maxVisiblePerGroup: 3,
  newestOnTop: true,
  duplicateStrategy: "replace",
  historyStorageKey: "design-system:toast-history",
  historyLimit: 200,
  historyTTL: 1000 * 60 * 60 * 24 * 30, // 30 days
  showDeletedFromHistoryIndicator: false,
  leaveAnimationDuration: 300,
  placement: "top",
  showProgressBar: true,
};

let currentConfig: ToastEngineConfig = { ...DEFAULT_TOAST_CONFIG };

/** Call once at app bootstrap to override defaults — not meant to be called per-toast. */
export function configureToast(overrides: Partial<ToastEngineConfig>): void {
  currentConfig = { ...currentConfig, ...overrides };
}

export function getToastConfig(): ToastEngineConfig {
  return currentConfig;
}
