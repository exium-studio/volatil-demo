// src/features/shared/types/spatial-basis-filter-select.type.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";

export type SpatialBasisFilterSelectProps = {
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
