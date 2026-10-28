// src/features/shared/types/status-filter-select.type.ts

import type {
  FocusSelectInputProps,
  FocusSelectOption,
} from "@/design-system/components/input/types/focus-select.type";

export type StatusFilterSelectProps = Omit<
  FocusSelectInputProps,
  "options"
> & {
  options?: FocusSelectOption[];
};
