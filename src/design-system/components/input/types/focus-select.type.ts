// src/design-system/components/input/types/focus-select.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type React from "react";

export type FocusSelectOption = {
  label: string;
  value: string;
  description?: string;
  icon?: React.ComponentType;
};

export type FocusSelectInputProps = Omit<
  ButtonProps,
  "onChange" | "value" | "defaultValue"
> & {
  modalKey?: string;
  label?: string;
  placeholder?: string;
  options: FocusSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option?: FocusSelectOption) => void;
  clearable?: boolean;
  parentModalKey?: string;
  isFetching?: boolean;
};
