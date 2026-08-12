// src/design-system/components/focus-alert/types/focus-alert.type.ts

import type { ReactNode } from "react";

export type FocusAlertRenderFn = () => ReactNode;

export type FocusAlertVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "question";

export type FocusAlertItemProps = {
  modalKey?: string;
  variant?: FocusAlertVariant;
  title?: string;
  description?: string;
  onDone?: () => void;
};

export type FocusAlertTriggerProps = FocusAlertItemProps & {
  modalKey: string;
  children: ReactNode;
};

export type FocusAlertContentProps = {
  variant?: FocusAlertVariant;
  title?: string;
  description?: string;
  transition: boolean;
  close: () => void;
  onDone?: () => void;
};
