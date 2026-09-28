// src/features/shared/types/status-filter-select.type.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";

export type StatusFilterSelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: FocusSelectOption[];
  placeholder?: string;
  modalKey?: string;
  w?: string | number;
  disabled?: boolean;
  clearable?: boolean;
};
