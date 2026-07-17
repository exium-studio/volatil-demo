// src/design-system/components/input/utils/date.utils.ts

import type {
  DateFormat,
  DateValue,
} from "@/design-system/components/input/types/date-picker.type";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";

// -------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const WEEKDAYS_HEADER = ["S", "M", "T", "W", "T", "F", "S"] as const;

export const YEAR_PAGE_SIZE = 16;

// -------------------------------------------------------------------------------------
// Parsing
// -------------------------------------------------------------------------------------

/** Parse an ISO date string (YYYY-MM-DD) into a CalendarDate. Returns null on failure. */
export function parseISODate(
  value: DateValue | undefined,
): CalendarDate | null {
  if (value == null) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

/** Serialize a CalendarDate to ISO string (YYYY-MM-DD). */
export function toISODate(date: CalendarDate): string {
  return date.toString();
}

// -------------------------------------------------------------------------------------
// Timezone
// -------------------------------------------------------------------------------------

/** Return the effective timezone string. */
export function resolveTimezone(timezone: string | undefined): string {
  return timezone ?? getLocalTimeZone();
}

/** Return UTC offset string for a timezone, e.g. "UTC+07:00". */
export function getUTCOffsetLabel(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
    return offset;
  } catch {
    return "UTC";
  }
}

/** Build the footer timezone label, e.g. "Asia/Jakarta (UTC+07:00)". */
export function buildTimezoneLabel(timezone: string): string {
  const offset = getUTCOffsetLabel(timezone);
  return `${timezone} (${offset})`;
}

// -------------------------------------------------------------------------------------
// Today
// -------------------------------------------------------------------------------------

export function getTodayDate(timezone: string): CalendarDate {
  return today(timezone);
}

// -------------------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------------------

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export type ValidationOptions = {
  min?: string;
  max?: string;
  disabledDates?: string[];
};

/**
 * Layer 1 + 2: Validate individual numeric fields and real calendar date.
 */
export function validateFields(
  day: number,
  month: number,
  year: number,
): ValidationResult {
  if (year < 1 || year > 9999) return { valid: false, reason: "Invalid year" };
  if (month < 1 || month > 12) return { valid: false, reason: "Invalid month" };
  if (day < 1 || day > 31) return { valid: false, reason: "Invalid day" };

  // Real calendar check via CalendarDate
  try {
    new CalendarDate(year, month, day);
    return { valid: true };
  } catch {
    return { valid: false, reason: "Invalid date" };
  }
}

/**
 * Full validation pipeline (Layers 1-5).
 * Accepts pre-parsed CalendarDate to avoid duplicate parsing.
 */
export function validateDate(
  date: CalendarDate,
  options: ValidationOptions = {},
): ValidationResult {
  const { min, max, disabledDates } = options;

  if (min) {
    const minDate = parseISODate(min);
    if (minDate && date.compare(minDate) < 0) {
      return { valid: false, reason: `Date before minimum (${min})` };
    }
  }

  if (max) {
    const maxDate = parseISODate(max);
    if (maxDate && date.compare(maxDate) > 0) {
      return { valid: false, reason: `Date after maximum (${max})` };
    }
  }

  if (disabledDates?.length) {
    const iso = toISODate(date);
    if (disabledDates.includes(iso)) {
      return { valid: false, reason: "Date is disabled" };
    }
  }

  return { valid: true };
}

/**
 * Full validation pipeline from raw field values.
 * Combines Layer 1-2 (fields) + Layer 3-5 (constraints).
 */
export function validateFromFields(
  day: number,
  month: number,
  year: number,
  options: ValidationOptions = {},
): ValidationResult {
  const fieldResult = validateFields(day, month, year);
  if (!fieldResult.valid) return fieldResult;

  const date = new CalendarDate(year, month, day);
  return validateDate(date, options);
}

// -------------------------------------------------------------------------------------
// Calendar grid generation
// -------------------------------------------------------------------------------------

export type CalendarDay = {
  date: CalendarDate;
  isCurrentMonth: boolean;
};

/**
 * Generate a 6-row × 7-col calendar grid for the given month/year.
 * Row starts on Sunday (index 0).
 */
export function buildCalendarGrid(
  year: number,
  month: number,
): CalendarDay[][] {
  const firstOfMonth = new CalendarDate(year, month, 1);
  // CalendarDate.toDate needs a timezone; use a simple approach via JS Date
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun

  const daysInMonth = getDaysInMonth(year, month);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const cells: CalendarDay[] = [];

  // Fill leading days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({
      date: new CalendarDate(prevYear, prevMonth, day),
      isCurrentMonth: false,
    });
  }

  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: firstOfMonth.set({ day: d }),
      isCurrentMonth: true,
    });
  }

  // Fill trailing days from next month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({
      date: new CalendarDate(nextYear, nextMonth, nextDay++),
      isCurrentMonth: false,
    });
  }

  // Split into rows
  const rows: CalendarDay[][] = [];
  for (let i = 0; i < 42; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// -------------------------------------------------------------------------------------
// Year pages
// -------------------------------------------------------------------------------------

export function getYearPageStart(year: number): number {
  return Math.floor(year / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE;
}

export function buildYearPage(pageStart: number): number[] {
  return Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => pageStart + i);
}

// -------------------------------------------------------------------------------------
// Format order
// -------------------------------------------------------------------------------------

export type FieldOrder = [
  "day" | "month" | "year",
  "day" | "month" | "year",
  "day" | "month" | "year",
];

export function getFieldOrder(format: DateFormat): FieldOrder {
  switch (format) {
    case "dmy":
      return ["day", "month", "year"];
    case "mdy":
      return ["month", "day", "year"];
    case "ymd":
      return ["year", "month", "day"];
  }
}

export function getPlaceholder(field: "day" | "month" | "year"): string {
  switch (field) {
    case "day":
      return "DD";
    case "month":
      return "MM";
    case "year":
      return "YYYY";
  }
}

export function getMaxLength(field: "day" | "month" | "year"): number {
  return field === "year" ? 4 : 2;
}
