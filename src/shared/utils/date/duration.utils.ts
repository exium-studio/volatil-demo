// src/shared/utils/date/duration.utils.ts

import type {
  DurationUnit,
  DurationValue,
} from "@/design-system/components/input/types/duration-input.type";
import { t } from "@/shared/libs/i18n";

export const DURATION_UNIT_TO_MS: Record<DurationUnit, number> = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
};

/**
 * List of duration units ordered from largest to smallest.
 */
export const DURATION_UNITS_DESC: DurationUnit[] = [
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
];

/**
 * Convert value and unit to total milliseconds.
 */
export function durationToMs(value: number, unit: DurationUnit): number {
  if (!Number.isFinite(value)) return 0;
  const factor = DURATION_UNIT_TO_MS[unit] ?? 1;
  return Math.round(value * factor);
}

/**
 * Converts milliseconds into the largest integer unit possible.
 * Example:
 * - 2000 ms -> { value: 2, unit: "second" }
 * - 120000 ms -> { value: 2, unit: "minute" }
 * - 86400000 ms -> { value: 1, unit: "day" }
 * - 2500 ms -> { value: 2.5, unit: "second" }
 * If ms is 0 or negative, falls back to defaultUnit (default: "second").
 */
export function msToBestDuration(
  ms: number | undefined | null,
  options?: {
    allowedUnits?: DurationUnit[];
    defaultUnit?: DurationUnit;
  },
): DurationValue {
  const allowed = options?.allowedUnits ?? DURATION_UNITS_DESC;
  const fallbackUnit =
    options?.defaultUnit && allowed.includes(options.defaultUnit)
      ? options.defaultUnit
      : (allowed[0] ?? "minute");

  if (ms === undefined || ms === null || !Number.isFinite(ms) || ms === 0) {
    return { value: 0, unit: fallbackUnit };
  }

  const positiveMs = Math.abs(ms);

  // Filter allowed units maintaining descending order
  const orderedAllowed = DURATION_UNITS_DESC.filter((unit) =>
    allowed.includes(unit),
  );

  // 1. Try finding an exact integer division starting from the largest unit
  for (const unit of orderedAllowed) {
    const factor = DURATION_UNIT_TO_MS[unit];
    if (positiveMs >= factor && positiveMs % factor === 0) {
      return {
        value: ms / factor,
        unit,
      };
    }
  }

  // 2. If no exact division, choose the largest unit where value >= 1
  for (const unit of orderedAllowed) {
    const factor = DURATION_UNIT_TO_MS[unit];
    if (positiveMs >= factor) {
      const computed = Number((ms / factor).toFixed(2));
      return {
        value: computed,
        unit,
      };
    }
  }

  // 3. Fallback to smallest available unit or millisecond
  const smallestUnit =
    orderedAllowed[orderedAllowed.length - 1] ?? fallbackUnit;
  const factor = DURATION_UNIT_TO_MS[smallestUnit];
  return {
    value: Number((ms / factor).toFixed(2)),
    unit: smallestUnit,
  };
}

/**
 * Returns localized label for a duration unit using Paraglide JS.
 */
export function getDurationUnitLabel(unit: DurationUnit): string {
  switch (unit) {
    case "millisecond":
      return t["duration.unit_millisecond"]?.() ?? "Milidetik";
    case "second":
      return t["duration.unit_second"]?.() ?? "Detik";
    case "minute":
      return t["duration.unit_minute"]?.() ?? "Menit";
    case "hour":
      return t["duration.unit_hour"]?.() ?? "Jam";
    case "day":
      return t["duration.unit_day"]?.() ?? "Hari";
    case "week":
      return t["duration.unit_week"]?.() ?? "Minggu";
    default:
      return unit;
  }
}

/**
 * Renders milliseconds into human-readable formatted string with largest unit first.
 * Example:
 * - 2000 ms -> "2 Detik" (ID) or "2 Seconds" (EN)
 */
export function formatDurationMs(
  ms: number | undefined | null,
  options?: {
    allowedUnits?: DurationUnit[];
    defaultUnit?: DurationUnit;
  },
): string {
  const { value, unit } = msToBestDuration(ms, options);
  const label = getDurationUnitLabel(unit);
  return `${value} ${label}`;
}
