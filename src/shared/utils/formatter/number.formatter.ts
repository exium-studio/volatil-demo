// src/shared/utils/formatter/number.formatter.ts

// src/shared/utils/format/number.ts

const DEFAULT_LOCALE = "id-ID";

export type FormatNumberStyle = "decimal" | "currency" | "percent" | "unit";
export type FormatNumberNotation =
  | "standard"
  | "scientific"
  | "engineering"
  | "compact";
export type FormatNumberCompactDisplay = "short" | "long";
export type FormatNumberCurrencyDisplay =
  | "symbol"
  | "narrowSymbol"
  | "code"
  | "name";
export type FormatNumberUnitDisplay = "short" | "long" | "narrow";
export type FormatNumberSignDisplay =
  | "auto"
  | "never"
  | "always"
  | "exceptZero";

export type FormatNumberOptions = {
  locale?: string;
  style?: FormatNumberStyle;
  currency?: string;
  currencyDisplay?: FormatNumberCurrencyDisplay;
  unit?: string;
  unitDisplay?: FormatNumberUnitDisplay;
  notation?: FormatNumberNotation;
  compactDisplay?: FormatNumberCompactDisplay;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumIntegerDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  signDisplay?: FormatNumberSignDisplay;
  useGrouping?: boolean;
};

/**
 * Format a number using Intl.NumberFormat with sensible defaults for Indonesian locale.
 * Supports decimal, currency (IDR), percent, unit, compact, and scientific notations.
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  const {
    locale = DEFAULT_LOCALE,
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

  return new Intl.NumberFormat(locale, intlOptions).format(value);
}

// ---------------------------------------------------------------------------
// Shorthand helpers

/** 1500000 → "1.500.000" */
export function formatDecimal(value: number, locale = DEFAULT_LOCALE): string {
  return formatNumber(value, { locale });
}

/** 1500000 → "Rp1.500.000" */
export function formatCurrency(
  value: number,
  currency = "IDR",
  locale = DEFAULT_LOCALE,
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
  locale = DEFAULT_LOCALE,
): string {
  return formatNumber(value, {
    locale,
    style: "percent",
    maximumFractionDigits,
  });
}

/** 1500000 → "1,5 jt" (id-ID compact) */
export function formatCompact(
  value: number,
  compactDisplay: FormatNumberCompactDisplay = "short",
  locale = DEFAULT_LOCALE,
): string {
  return formatNumber(value, { locale, notation: "compact", compactDisplay });
}

/** 1500 → "1,5rb" or "1,5 ribu" */
export function formatCompactLong(
  value: number,
  locale = DEFAULT_LOCALE,
): string {
  return formatCompact(value, "long", locale);
}

/** 75 → "+75" / "-75" */
export function formatSigned(value: number, locale = DEFAULT_LOCALE): string {
  return formatNumber(value, { locale, signDisplay: "always" });
}

/** 1234.5678 → "1,23E3" */
export function formatScientific(
  value: number,
  locale = DEFAULT_LOCALE,
): string {
  return formatNumber(value, { locale, notation: "scientific" });
}
