import type { ComponentType, ReactNode } from "react";

export type FocusAlertTriggerProps = {
  children?: ReactNode;
  modalKey: string;
  colorPalette?: string;
  icon?: ComponentType;
  title?: string;
  description?: string;
  onConfirm?: () => void;
};
