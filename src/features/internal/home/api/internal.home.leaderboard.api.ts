// src/features/internal/home/api/internal.home.leaderboard.api.ts

import type { InternalLeaderboardResponse } from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalLeaderboardApi = async (
  period?: HomePeriod,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalLeaderboardResponse>> => {
  return apiClient.get<ApiResponse<InternalLeaderboardResponse>>(
    "/api/internal/home/leaderboard",
    { params: { period }, signal },
  );
};
