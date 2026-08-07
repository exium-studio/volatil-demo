// src/features/internal/home/types/internal.home.data-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type InternalHomeDataSummaryProps = StackProps;

export type InternalHomeDataSummaryHeaderProps = {
  period: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void;
};

export type InternalHomeDataSummaryChartsProps = {
  period: HomePeriod;
};

export type DataSummaryStatusConfig = {
  key: "active" | "inactive";
  label: string;
  colorPalette?: string;
  bg?: string;
  legendColor: string;
  striped: boolean;
};

export type InternalHomeDataSummaryLegendProps = StackProps & {
  legendColor: string;
  label: string;
  value: number;
};

export type InternalHomeDataSummaryResponse = {
  field: { active: number; inactive: number };
  area: { active: number; inactive: number };
};
