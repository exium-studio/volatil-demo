// src/design-system/components/input/types/duration-input.type.ts

export type DurationUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week";

export type DurationValue = {
  value: number;
  unit: DurationUnit;
};

export type DurationInputProps = {
  /** Value in milliseconds. Defaults to undefined (uncontrolled) or controlled value */
  value?: number;
  /** Default value in milliseconds (uncontrolled) */
  defaultValue?: number;
  /** Callback fired when milliseconds value changes */
  onValueChange?: (ms: number, details: DurationValue) => void;
  /** HTML name attribute for form submission (stores milliseconds) */
  name?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Placeholder for the numeric input */
  placeholder?: string;
  /** Minimum numeric value allowed (in currently selected unit). Defaults to 0 */
  min?: number;
  /** Maximum numeric value allowed (in currently selected unit) */
  max?: number;
  /** Step increment for numeric input. Defaults to 1 */
  step?: number;
  /** Allowed units. Defaults to all units ["millisecond", "second", "minute", "hour", "day", "week"] */
  allowedUnits?: DurationUnit[];
  /** Default unit when value is 0 or undefined. Defaults to "minute" */
  defaultUnit?: DurationUnit;
  /** Width or style overrides */
  w?: string | number;
  width?: string | number;
  /** ID for accessibility */
  id?: string;
};
