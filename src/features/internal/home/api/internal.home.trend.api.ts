// src/features/internal/home/api/internal.home.trend.api.ts

import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalTrendApi = async (
  period?: HomePeriod,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalHomeTrendItem[]>> => {
  return apiClient.get<ApiResponse<InternalHomeTrendItem[]>>(
    "/api/internal/home/trends",
    { params: { period }, signal },
  );
};
