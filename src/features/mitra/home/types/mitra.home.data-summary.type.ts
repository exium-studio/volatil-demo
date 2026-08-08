// src/features/mitra/home/types/mitra.home.data-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { MitraHomeTransactionItem } from "@/features/mitra/home/types/mitra.home.last-transaction.type";

export type MitraHomePeriod = "1d" | "1w" | "1m" | "1y" | "all";

export type MitraHomeDataSummaryProps = StackProps;

export type MitraHomeDataSummaryHeaderProps = {
  period: MitraHomePeriod;
  onPeriodChange: (period: MitraHomePeriod) => void;
};

export type MitraHomeDataSummaryChartsProps = {
  period: MitraHomePeriod;
};

export type MitraHomeSummaryStatus = "active" | "almostExpired" | "expired";

export type MitraHomeDataSummaryStatusConfig = {
  key: MitraHomeSummaryStatus;
  label: string;
  colorPalette?: string;
  bg?: string;
  legendColor: string;
  striped: boolean;
};

export type MitraHomeDataSummaryLegendProps = StackProps & {
  legendColor: string;
  label: string;
  value: number;
};

export type MitraHomeSummaryResponse = {
  active: number;
  almostExpired: number;
  expired: number;
};

export type MitraHomeDataSummaryResponse = {
  field: MitraHomeSummaryResponse;
  area: MitraHomeSummaryResponse;
};

export type MitraHomeCartSummaryResponse = {
  totalField: number;
  totalArea: number;
  totalIgtData: number;
  subtotalPrice: number;
};

export type MitraHomeDataResponse = {
  dataSummary: Record<MitraHomePeriod, MitraHomeDataSummaryResponse>;
  financialFlow: Record<MitraHomePeriod, { sale: number; label: string }[]>;
  cartSummary: MitraHomeCartSummaryResponse;
  lastTransactions: MitraHomeTransactionItem[];
};

// Aliases for backwards compatibility
export type HomePeriod = MitraHomePeriod;
export type HomeSummaryStatus = MitraHomeSummaryStatus;
export type HomeSummaryResponse = MitraHomeSummaryResponse;
export type HomeDataSummaryResponse = MitraHomeDataSummaryResponse;
export type HomeCartSummaryResponse = MitraHomeCartSummaryResponse;
export type HomeDataResponse = MitraHomeDataResponse;
