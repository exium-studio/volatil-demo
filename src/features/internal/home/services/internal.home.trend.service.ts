// src/features/internal/home/services/internal.home.trend.service.ts

import { fetchInternalTrendApi } from "@/features/internal/home/api/internal.home.trend.api";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyInternalTrends } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const getInternalTrend = async (
  period: HomePeriod = "all",
  signal?: AbortSignal,
): Promise<InternalHomeTrendItem[]> => {
  try {
    const response = await fetchInternalTrendApi(period, signal);
    if (response?.data) return response.data;
    return [];
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (isDummyDataEnabled() && error instanceof ApiError && error.statusCode === 404) {
      return dummyInternalTrends[period] ?? [];
    }
    return [];
  }
};
