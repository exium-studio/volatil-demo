// src/features/internal/home/services/internal.home.leaderboard.service.ts

import { fetchInternalLeaderboardApi } from "@/features/internal/home/api/internal.home.leaderboard.api";
import type { InternalLeaderboardResponse } from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyTopMitraList,
  dummyTopIgtLayers,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY: InternalLeaderboardResponse = { topMitraList: [], topIgtLayers: [] };
const DUMMY: InternalLeaderboardResponse = {
  topMitraList: dummyTopMitraList,
  topIgtLayers: dummyTopIgtLayers,
};

export const getInternalLeaderboard = async (
  period?: HomePeriod,
  signal?: AbortSignal,
): Promise<InternalLeaderboardResponse> => {
  try {
    const response = await fetchInternalLeaderboardApi(period, signal);
    if (response?.data) return response.data;
    return EMPTY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (isDummyDataEnabled() && error instanceof ApiError && error.statusCode === 404) {
      return DUMMY;
    }
    return EMPTY;
  }
};
