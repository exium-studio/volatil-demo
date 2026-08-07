// src/features/internal/home/types/internal.home.order-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type { ComponentType } from "react";

export type InternalHomeOrderSummaryProps = StackProps;

export type InternalHomeOrderSummaryHeaderProps = {
  period: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void;
};

export type InternalHomeOrderStatConfig = {
  icon: ComponentType;
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  isCurrency?: boolean;
};

export type InternalHomeOrderStatItemProps = StackProps & {
  stat: InternalHomeOrderStatConfig;
};
