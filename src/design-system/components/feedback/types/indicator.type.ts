// src/design-system/components/feedback/types/indicator.type.ts

import type { AppTablerIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { CircleProps } from "@/design-system/components/layout/types/box.type";

export type DotIndicatorProps = {
  checked?: boolean;
} & CircleProps;

export type CheckIndicatorProps = {
  checked?: boolean;
} & AppTablerIconProps;

export type RadioIndicatorProps = {
  checked?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
} & CircleProps;
