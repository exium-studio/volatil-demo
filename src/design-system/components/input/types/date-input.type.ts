// src/design-system/components/input/types/date-input.type.ts

import type { DatePickerProps } from "@/design-system/components/input/types/date-picker.type";

export type DateInputProps = DatePickerProps & {
  modalKey?: string;
  datePickerSubtitle?: string;
};

export type FieldKey = "day" | "month" | "year";

export type FieldValues = {
  day: string;
  month: string;
  year: string;
};
