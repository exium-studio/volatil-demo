// src/design-system/components/input/types/date-picker.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { CalendarDate } from "@internationalized/date";
import type { ReactNode } from "react";

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

export type DatePickerMode = "day" | "month" | "year";

export type DateFormat = "dmy" | "mdy" | "ymd";

export type DateValue = string | null;

export type NavHeaderProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onLabelClick?: () => void;
  labelClickable?: boolean;
};

export type DayViewProps = {
  viewDate: CalendarDate;
  selectedDate: CalendarDate | null;
  todayDate: CalendarDate;
  isDateDisabled: (date: CalendarDate) => boolean;
  onSelectDay: (date: CalendarDate) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToMonthView: () => void;
};

export type MonthViewProps = {
  viewDate: CalendarDate;
  onSelectMonth: (month: number) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onGoToYearView: () => void;
};

export type YearViewProps = {
  viewDate: CalendarDate;
  onSelectYear: (year: number) => void;
  yearPageStart: number;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export type DatePickerTriggerProps = DatePickerProps & {
  children: ReactNode;
  modalKey: string;
  datePickerSubtitle?: string;
};
