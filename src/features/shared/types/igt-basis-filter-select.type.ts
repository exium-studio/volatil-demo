// src/features/shared/types/igt-basis-filter-select.type.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";

export type IgtBasisFilterSelectProps = {
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

/** @deprecated alias for IgtBasisFilterSelectProps */
export type SpatialBasisFilterSelectProps = IgtBasisFilterSelectProps;
