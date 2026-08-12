// src/design-system/components/focus-alert/ui/focus-alert-key-context.ts

import { createContext, useContext } from "react";

export type FocusAlertContextValue = {
  modalKey: string;
};

export const FocusAlertContext = createContext<
  FocusAlertContextValue | undefined
>(undefined);

export const useFocusAlertContext = () => useContext(FocusAlertContext);
