import type { FocusAlertContextValue } from "@/design-system/components/focus-alert/types/focus-alert.type";
import { createContext, useContext } from "react";

export const FocusAlertContext = createContext<
  FocusAlertContextValue | undefined
>(undefined);

export const useFocusAlertContext = () => useContext(FocusAlertContext);
