// src/features/internal/home/types/internal.home.api.type.ts

import type { InternalHomeDataListItem } from "@/features/internal/home/types/internal.home.data-list.type";
import type { InternalHomeDataSummaryResponse } from "@/features/internal/home/types/internal.home.data-summary.type";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type InternalHomeOrderSummaryResponse = {
  activeOrders: number;
  completedOrders: number;
  igtRequests: number;
  totalRevenue: number;
};

export type InternalHomeDataResponse = {
  dataSummary: Record<MitraHomePeriod, InternalHomeDataSummaryResponse>;
  serviceRates: InternalHomeServiceRateItem[];
  orderSummary: InternalHomeOrderSummaryResponse;
  dataList: InternalHomeDataListItem[];
};

// Aliases for compatibility
export type InternalOrderSummaryResponse = InternalHomeOrderSummaryResponse;
