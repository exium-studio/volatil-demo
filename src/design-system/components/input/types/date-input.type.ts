// src/design-system/components/input/types/date-input.type.ts

import type { DatePickerProps } from "@/design-system/components/input/types/date-picker.type";

import type { ChangeEvent, FocusEvent } from "react";

export type DateInputProps = DatePickerProps & {
  modalKey?: string;
  datePickerSubtitle?: string;

  // React Hook Form
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};

export type FieldKey = "day" | "month" | "year";

export type FieldValues = {
  day: string;
  month: string;
  year: string;
};
