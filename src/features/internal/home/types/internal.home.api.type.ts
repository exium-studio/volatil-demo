import type { InternalHomeDataSummaryResponse } from "@/features/internal/home/types/internal.home.data-summary.type";
import type {
  SystemHealthMetricItem,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type InternalHomeDataResponse = {
  dataSummary: Record<HomePeriod, InternalHomeDataSummaryResponse>;
  serviceRates: InternalHomeServiceRateItem[];
  acquisitionTrends: Record<HomePeriod, InternalHomeTrendItem[]>;
  topMitraList: TopMitraAcquisitionItem[];
  topIgtLayers: TopIgtLayerItem[];
  systemHealth: SystemHealthMetricItem[];
};
