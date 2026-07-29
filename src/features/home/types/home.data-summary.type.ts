import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type LegendProps = StackProps & {
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
