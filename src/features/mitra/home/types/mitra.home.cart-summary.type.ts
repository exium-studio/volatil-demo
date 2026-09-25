// src\features\mitra\home\types\mitra.home.cart-summary.type.ts

// src\features\mitra\home\types\mitra.home.cart-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ComponentType } from "react";

export type MitraHomeCartSummaryProps = StackProps;

export type MitraHomeCartSummaryStatItemProps = StackProps & {
  label: string;
  value: number;
  suffix?: string;
  icon?: ComponentType;
  colorPalette?: string;
};

export type MitraHomeCartStatConfig = {
  icon: ComponentType;
  label: string;
  value: number;
  suffix?: string;
  colorPalette?: string;
  isCompact?: boolean;
};

export type MitraHomeCartSummaryResponse = {
  totalField: number;
  totalArea: number;
  totalIgtData: number;
  subtotalPrice: number;
};
