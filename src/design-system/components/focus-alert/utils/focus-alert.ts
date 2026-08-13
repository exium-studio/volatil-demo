// src/design-system/components/focus-alert/utils/focus-alert.ts

import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type { FocusAlertRenderFn } from "@/design-system/components/focus-alert/types/focus-alert.type";

export function focusAlert(modalKey: string, render: FocusAlertRenderFn) {
  // 1. Register or update the render function in the store
  useFocusAlerterStore.getState().open(modalKey, render);

  // 2. Open the modal programmatically by setting the URL search parameter
  const url = new URL(window.location.href);
  url.searchParams.set("activeModalKey", modalKey);
  window.history.pushState(null, "", url.pathname + url.search + url.hash);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

focusAlert.close = () => {
  window.history.back();
};
