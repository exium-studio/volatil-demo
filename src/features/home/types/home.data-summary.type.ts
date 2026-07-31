// src/features/home/types/home.data-summary.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

import type { TransactionItem } from "@/features/home/types/home.last-transaction.type";

export interface HomeDataSummaryStatusConfig {
  key: HomeSummaryStatus;
  label: string;
  colorPalette?: string;
  bg?: string;
  legendColor: string;
  striped: boolean;
}

export type HomeDataSummaryLegendProps = StackProps & {
  legendColor: string;
  label: string;
  value: number;
};

export type HomeSummaryStatus = "active" | "almostExpired" | "expired";

export interface HomeSummaryResponse {
  active: number;
  almostExpired: number;
  expired: number;
}

export interface HomeDataSummaryResponse {
  field: HomeSummaryResponse;
  area: HomeSummaryResponse;
}

export interface HomeCartSummaryResponse {
  totalField: number;
  totalArea: number;
  totalIgtData: number;
  subtotalPrice: number;
}

export type HomePeriod = "1d" | "1w" | "1m" | "1y" | "all";

export interface HomeDataResponse {
  dataSummary: Record<HomePeriod, HomeDataSummaryResponse>;
  financialFlow: Record<HomePeriod, { sale: number; label: string }[]>;
  cartSummary: HomeCartSummaryResponse;
  lastTransactions: TransactionItem[];
}

