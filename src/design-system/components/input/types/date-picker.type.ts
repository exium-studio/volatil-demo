// src/design-system/components/input/types/date-picker.type.ts

import type { StackProps } from "@/design-system/components/layout/types/stack.type";

export type DateFormat = "dmy" | "mdy" | "ymd";

export type DateValue = string | null;

export type DatePickerProps = Omit<
  StackProps,
  "value" | "defaultValue" | "onChange"
> & {
  value?: DateValue;
  defaultValue?: DateValue;
  onValueChange?: (value: DateValue) => void;

  inputFormat?: DateFormat;

  min?: string;
  max?: string;

  disabledDates?: string[];

  timezone?: string;
  locale?: string;

  disabled?: boolean;
};
