// src/features/internal/home/types/internal.home.trend.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type InternalHomeTrendProps = StackProps;

export type InternalHomeTrendItem = {
  label: string;
  field: number;
  area: number;
  revenue: number;
};

export type InternalHomeTrendHeaderProps = {
  period: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void;
};

export type InternalHomeTrendChartProps = {
  period: HomePeriod;
};
