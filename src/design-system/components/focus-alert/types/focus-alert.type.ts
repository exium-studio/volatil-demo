import type { ReactNode, ComponentType } from "react";

export type FocusAlertRenderFn = () => ReactNode;

export type FocusAlertItemProps = {
  modalKey?: string;
  colorPalette?: string;
  icon?: ComponentType;
  title?: string;
  description?: string;
  onDone?: () => void;
};

export type FocusAlertTriggerProps = FocusAlertItemProps & {
  modalKey: string;
  children: ReactNode;
};

export type FocusAlertContentProps = {
  colorPalette: string;
  icon: ComponentType;
  title?: string;
  description?: string;
  transition: boolean;
  close: () => void;
  onDone?: () => void;
};
