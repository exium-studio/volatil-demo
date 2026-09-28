// src/design-system/components/input/types/password-input.type.ts

import type { InputGroupProps } from "@/design-system/components/input/types/input-group.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { Options } from "check-password-strength";
import type { ReactNode } from "react";

export type PasswordVisibilityProps = {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: { on: ReactNode; off: ReactNode };
};

export type PasswordInputProps = InputProps &
  PasswordVisibilityProps & {
    rootProps?: InputGroupProps;
    withPasswordStrength?: boolean;
    strengthOptions?: Options<string>;
  };

export type PasswordStrengthMeterProps = StackProps & {
  max?: number;
  value: number;
};
