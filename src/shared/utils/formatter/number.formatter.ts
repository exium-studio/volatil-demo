import { getLocale } from "@/paraglide/runtime";
import type {
  FormatNumberCompactDisplay,
  FormatNumberOptions,
} from "@/shared/types/number.formatter.type";

function getActiveLocale(locale?: string): string {
  if (locale) return locale;
  try {
    const current = getLocale();
    return current === "en" ? "en-US" : "id-ID";
  } catch {
    return "id-ID";
  }
}

/**
 * Format a number using Intl.NumberFormat with dynamic active locale.
 * Supports decimal, currency (IDR), percent, unit, compact, and scientific notations.
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  const {
    locale,
    style = "decimal",
    currency = "IDR",
    currencyDisplay = "symbol",
    unit,
    unitDisplay = "short",
    notation = "standard",
    compactDisplay = "short",
    minimumFractionDigits,
    maximumFractionDigits,
    minimumIntegerDigits,
    minimumSignificantDigits,
    maximumSignificantDigits,
    signDisplay = "auto",
    useGrouping = true,
  } = options;

  const intlOptions: Intl.NumberFormatOptions = {
    style,
    notation,
    compactDisplay,
    signDisplay,
    useGrouping,
  };

  if (style === "currency") {
    intlOptions.currency = currency;
    intlOptions.currencyDisplay = currencyDisplay;
  }

  if (style === "unit" && unit) {
    intlOptions.unit = unit;
    intlOptions.unitDisplay = unitDisplay;
  }

  if (minimumFractionDigits !== undefined)
    intlOptions.minimumFractionDigits = minimumFractionDigits;
  if (maximumFractionDigits !== undefined)
    intlOptions.maximumFractionDigits = maximumFractionDigits;
  if (minimumIntegerDigits !== undefined)
    intlOptions.minimumIntegerDigits = minimumIntegerDigits;
  if (minimumSignificantDigits !== undefined)
    intlOptions.minimumSignificantDigits = minimumSignificantDigits;
  if (maximumSignificantDigits !== undefined)
    intlOptions.maximumSignificantDigits = maximumSignificantDigits;

  return new Intl.NumberFormat(getActiveLocale(locale), intlOptions).format(
    value,
  );
}

// ---------------------------------------------------------------------------
// Shorthand helpers

/** 1500000 → "1.500.000" (id) / "1,500,000" (en) */
export function formatDecimal(value: number, locale?: string): string {
  return formatNumber(value, { locale });
}

/** 1500000 → "Rp1.500.000" (id) / "IDR 1,500,000" (en) */
export function formatCurrency(
  value: number,
  currency = "IDR",
  locale?: string,
): string {
  return formatNumber(value, {
    locale,
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

/** 0.75 → "75%" */
export function formatPercent(
  value: number,
  maximumFractionDigits = 1,
  locale?: string,
): string {
  return formatNumber(value, {
    locale,
    style: "percent",
    maximumFractionDigits,
  });
}

/** 1500000 → "1,5 jt" (id) / "1.5M" (en) */
export function formatCompact(
  value: number,
  compactDisplay: FormatNumberCompactDisplay = "short",
  locale?: string,
): string {
  return formatNumber(value, { locale, notation: "compact", compactDisplay });
}

/** 15000000 → "Rp 15 jt" (id) / "IDR 15M" (en) */
export function formatCompactCurrency(
  value: number,
  currency = "IDR",
  compactDisplay: FormatNumberCompactDisplay = "short",
  locale?: string,
): string {
  return formatNumber(value, {
    locale,
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay,
    maximumFractionDigits: 1,
  });
}

/** 1500 → "1,5rb" or "1,5 ribu" */
export function formatCompactLong(value: number, locale?: string): string {
  return formatCompact(value, "long", locale);
}

/** 75 → "+75" / "-75" */
export function formatSigned(value: number, locale?: string): string {
  return formatNumber(value, { locale, signDisplay: "always" });
}

/** 1234.5678 → "1,23E3" */
export function formatScientific(value: number, locale?: string): string {
  return formatNumber(value, { locale, notation: "scientific" });
}
