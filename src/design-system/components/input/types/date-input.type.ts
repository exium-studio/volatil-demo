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

export type FieldInputProps = {
  id: string;
  fieldKey: FieldKey;
  value: string;
  disabled?: boolean;
  onValueChange: (field: FieldKey, value: string) => void;
  onAutoAdvance: (fromField: FieldKey) => void;
  onArrowNavigate: (fromField: FieldKey, direction: "left" | "right") => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  inputRef: import("react").RefObject<HTMLInputElement | null>;
};

