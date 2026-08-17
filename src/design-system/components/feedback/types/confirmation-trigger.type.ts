// src/design-system/components/feedback/types/confirmation-trigger.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { ComponentType, ReactNode } from "react";

export type ConfirmationTriggerProps = {
  children?: ReactNode;
  icon?: ComponentType | ReactNode;
  title?: string;
  desc?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  colorPalette?: string;
  modalKey?: string;
  confirmButtonProps?: Partial<ButtonProps>;
  onConfirm?: () => void;
  onCancel?: () => void;
};
