// src/shared/utils/formatter/byte.formatter.ts

import type {
  ByteUnit,
  FormatByteOptions,
} from "@/shared/types/byte.formatter.type";

const UNITS: ByteUnit[] = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

/**
 * Formats a byte number to a human-readable string, with optional forced unit.
 *
 * @param value The byte value to format
 * @param options Options to force unit and control decimals
 * @returns Formatted byte string, or empty string if value is null/undefined
 */
export function formatByte(
  value: number | null | undefined,
  options: FormatByteOptions = {},
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const { unit, decimals = 0 } = options;

  if (value === 0) {
    const targetUnit = unit || "B";
    return `0 ${targetUnit}`;
  }

  const k = 1024;

  if (unit) {
    const i = UNITS.indexOf(unit);
    if (i !== -1) {
      const formattedValue = (value / Math.pow(k, i)).toFixed(decimals);
      const numValue = parseFloat(formattedValue);
      return `${numValue} ${unit}`;
    }
  }

  // Automatic format
  const i = Math.min(
    Math.floor(Math.log(Math.abs(value)) / Math.log(k)),
    UNITS.length - 1,
  );
  const targetUnit = UNITS[i];
  const formattedValue = (value / Math.pow(k, i)).toFixed(decimals);
  const numValue = parseFloat(formattedValue);
  return `${numValue} ${targetUnit}`;
}
