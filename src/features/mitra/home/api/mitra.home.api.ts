// src/features/mitra/home/api/mitra.home.api.ts

import type {
  MitraHomeDataResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraHomeDataApi = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraHomeDataResponse>> => {
  return apiClient.get<ApiResponse<MitraHomeDataResponse>>("/mitra/home", {
    params: { period },
    signal,
  });
};
