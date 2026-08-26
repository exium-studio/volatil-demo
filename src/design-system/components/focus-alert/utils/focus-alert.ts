// src/design-system/components/focus-alert/utils/focus-alert.ts

import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type { FocusAlertRenderFn } from "@/design-system/components/focus-alert/types/focus-alert.type";
import { updateClickOrigin } from "@/design-system/components/overlay/stores/dialog-animation-store";

export function focusAlert(
  modalKey: string,
  render: FocusAlertRenderFn,
  originTarget?: EventTarget | HTMLElement | { x: number; y: number } | null,
) {
  // 1. Capture click origin from event / element / last pointer
  updateClickOrigin(modalKey, originTarget);

  // 2. Register or update the render function in the store
  useFocusAlerterStore.getState().open(modalKey, render);

  // 3. Open the modal programmatically by setting the URL search parameter
  const url = new URL(window.location.href);
  url.searchParams.set("activeModalKey", modalKey);
  window.history.pushState(null, "", url.pathname + url.search + url.hash);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

focusAlert.close = () => {
  window.history.back();
};
