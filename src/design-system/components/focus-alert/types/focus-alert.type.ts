// src/design-system/components/focus-alert/types/focus-alert.type.ts

// src\design-system\components\focus-alert\types\focus-alert.type.ts

// src\design-system\components\focus-alert\types\focus-alert.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { EmojiVariant } from "@/design-system/components/emoji/types/emoji.type";
import type { ComponentType, ReactNode } from "react";

export type FocusAlertRenderFn = () => ReactNode;

export type FocusAlertSemanticVariant =
  | "success"
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "help"
  | "neutral"
  | "celebrate";

export type FocusAlertVariant = EmojiVariant | FocusAlertSemanticVariant;

export type FocusAlertItemProps = {
  modalKey?: string;
  variant?: FocusAlertVariant;
  colorPalette?: string;
  icon?: ComponentType | ReactNode;
  emoji?: EmojiVariant;
  title?: string;
  description?: string;
  doneLabel?: string;
  cancelLabel?: string;
  doneButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  onDone?: () => void;
  onCancel?: () => void;
};

export type FocusAlertTriggerProps = FocusAlertItemProps & {
  modalKey: string;
  children: ReactNode;
};

export type FocusAlertContentProps = {
  variant?: FocusAlertVariant;
  colorPalette?: string;
  icon?: ComponentType | ReactNode;
  emoji?: EmojiVariant;
  title?: string;
  description?: string;
  transition?: boolean;
  doneLabel?: string;
  cancelLabel?: string;
  doneButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  close: () => void;
  onDone?: () => void;
  onCancel?: () => void;
};

export type FocusAlertContextValue = {
  modalKey: string;
};

export type FocusAlertEntry = {
  key: string;
  render: FocusAlertRenderFn;
};

export type FocusAlerterStore = {
  alerts: FocusAlertEntry[];
  open: (key: string, render: FocusAlertRenderFn) => void;
  close: (key: string) => void;
};

