// src/design-system/components/input/types/password-input.type.ts

import type { InputGroupProps } from "@/design-system/components/input/types/input-group.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";
import type { StackProps } from "@/design-system/components/layout/types/stack.type";
import type { Options } from "check-password-strength";

export type PasswordVisibilityProps = {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode };
};

export type PasswordInputProps = {
  rootProps?: InputGroupProps;
  withPasswordStrength?: boolean;
  strengthOptions?: Options<string>;
} & InputProps &
  PasswordVisibilityProps;

export type PasswordStrengthMeterProps = {
  max?: number;
  value: number;
} & StackProps;
