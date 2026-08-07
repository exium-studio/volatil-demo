// src/features/mitra/home/types/mitra.home.data-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { TransactionItem } from "@/features/mitra/home/types/mitra.home.last-transaction.type";

export type MitraHomeDataSummaryProps = StackProps;

export type MitraHomeDataSummaryHeaderProps = {
  period: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void;
};

export type MitraHomeDataSummaryChartsProps = {
  period: HomePeriod;
};

export type MitraHomeDataSummaryStatusConfig = {
  key: HomeSummaryStatus;
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

export type HomeSummaryStatus = "active" | "almostExpired" | "expired";

export type HomeSummaryResponse = {
  active: number;
  almostExpired: number;
  expired: number;
};

export type HomeDataSummaryResponse = {
  field: HomeSummaryResponse;
  area: HomeSummaryResponse;
};

export type HomeCartSummaryResponse = {
  totalField: number;
  totalArea: number;
  totalIgtData: number;
  subtotalPrice: number;
};

export type HomePeriod = "1d" | "1w" | "1m" | "1y" | "all";
export type MitraHomePeriod = HomePeriod;

// Responses

export type HomeDataResponse = {
  dataSummary: Record<HomePeriod, HomeDataSummaryResponse>;
  financialFlow: Record<HomePeriod, { sale: number; label: string }[]>;
  cartSummary: HomeCartSummaryResponse;
  lastTransactions: TransactionItem[];
};
