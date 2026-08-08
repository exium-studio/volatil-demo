// src/features/mitra/home/types/mitra.home.financial-flow.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type MitraHomeFinancialFlowProps = StackProps;

export type MitraHomeFinancialFlowHeaderProps = {
  period: MitraHomePeriod;
  onPeriodChange: (period: MitraHomePeriod) => void;
};

export type MitraHomeFinancialFlowChartContentProps = {
  period: MitraHomePeriod;
};
