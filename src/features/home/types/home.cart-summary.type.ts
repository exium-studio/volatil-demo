// src/features/home/types/home.cart-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ComponentType } from "react";

export type HomeCartSummaryStatItemProps = StackProps & {
  label: string;
  value: number;
  suffix?: string;
  icon?: ComponentType;
  color?: string;
};
