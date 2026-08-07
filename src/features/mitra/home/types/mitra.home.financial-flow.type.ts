// src/features/mitra/home/types/mitra.home.financial-flow.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
// import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type MitraHomeFinancialFlowProps = StackProps;

export type MitraHomeFinancialFlowHeaderProps = {
  period: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void;
};

export type MitraHomeFinancialFlowChartContentProps = {
  period: HomePeriod;
};
