// src/design-system/components/focus-alert/utils/focus-alert.ts

import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type { FocusAlertRenderFn } from "@/design-system/components/focus-alert/types/focus-alert.type";

export function focusAlert(modalKey: string, render: FocusAlertRenderFn) {
  useFocusAlerterStore.getState().open(modalKey, render);
}

focusAlert.close = (modalKey: string) => {
  useFocusAlerterStore.getState().close(modalKey);
};
