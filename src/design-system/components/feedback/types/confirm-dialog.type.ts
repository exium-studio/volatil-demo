// src/design-system/components/feedback/types/confirm-dialog.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { FaceEmojiVariant } from "@/design-system/components/feedback/types/face-emoji.type";
import type { ComponentType, ReactNode } from "react";

export type ConfirmDialogOptions = {
  title?: string;
  description?: string;
  desc?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  colorPalette?: string;
  variant?: FaceEmojiVariant;
  icon?: ComponentType | ReactNode;
  confirmButtonProps?: Partial<ButtonProps>;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};
