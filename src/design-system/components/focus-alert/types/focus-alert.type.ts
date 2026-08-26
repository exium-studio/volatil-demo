// src/design-system/components/focus-alert/types/focus-alert.type.ts

import type { FaceEmojiVariant } from "@/design-system/components/feedback/types/face-emoji.type";
import type { ReactNode } from "react";

export type FocusAlertRenderFn = () => ReactNode;

export type FocusAlertSemanticVariant =
  | "success"
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "help";

export type FocusAlertVariant = FaceEmojiVariant | FocusAlertSemanticVariant;

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
  transition?: boolean;
  close: () => void;
  onDone?: () => void;
};
