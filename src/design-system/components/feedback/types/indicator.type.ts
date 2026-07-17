// src/design-system/components/feedback/types/indicator.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { CircleProps } from "@/design-system/components/layout/types/box.type";

export type DotIndicatorProps = CircleProps & {
  checked?: boolean;
};

export type CheckIndicatorProps = AppIconProps & {
  checked?: boolean;
};

export type RadioIndicatorProps = CircleProps & {
  checked?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};
