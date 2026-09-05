<<<<<<< HEAD
// src/shared/types/number.formatter.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
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
