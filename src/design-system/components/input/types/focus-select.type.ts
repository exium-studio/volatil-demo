// src/design-system/components/input/types/focus-select.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type React from "react";

export type FocusSelectOption = {
  label: string;
  value: string;
  description?: string;
  icon?: React.ComponentType;
};

export type FocusSelectTriggerRenderParams = {
  selectedOption?: FocusSelectOption;
  value: string;
  placeholder: string;
  disabled?: boolean;
  clearable?: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleClear: (e: React.MouseEvent) => void;
};

export type FocusSelectInputProps = Omit<
  ButtonProps,
  "onChange" | "value" | "defaultValue" | "children"
> & {
  modalKey?: string;
  label?: string;
  placeholder?: string;
  options: FocusSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option?: FocusSelectOption) => void;
  clearable?: boolean;
  isFetching?: boolean;
  /** Optional custom trigger node or render function receiving trigger state */
  trigger?:
    | React.ReactNode
    | ((params: FocusSelectTriggerRenderParams) => React.ReactNode);
  children?:
    | React.ReactNode
    | ((params: FocusSelectTriggerRenderParams) => React.ReactNode);
};
