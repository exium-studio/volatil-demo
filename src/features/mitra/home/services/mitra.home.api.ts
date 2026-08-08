// src/features/mitra/home/services/mitra.home.api.ts

import type {
  MitraHomeDataResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const getMitraHomeData = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<MitraHomeDataResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<MitraHomeDataResponse>>(
      "/mitra/home",
      {
        params: { period },
        signal,
      },
    );
    return response.data ?? dummyMitraHomeData;
  } catch {
    return dummyMitraHomeData;
  }
};
