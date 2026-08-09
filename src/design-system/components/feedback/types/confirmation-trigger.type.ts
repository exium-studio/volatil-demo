// src/design-system/components/feedback/types/confirmation-trigger.type.ts

import type { ReactNode } from "react";

export type ConfirmationTriggerProps = {
  children?: ReactNode;
  title?: string;
  desc?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColorPalette?: string;
  modalKey?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};
