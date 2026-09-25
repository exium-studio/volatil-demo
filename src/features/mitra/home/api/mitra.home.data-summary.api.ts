// src\features\mitra\home\api\mitra.home.data-summary.api.ts

import type {
  MitraHomeDataSummaryResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraDataSummaryApi = async (
  period: MitraHomePeriod = "all",
  signal?: AbortSignal,
): Promise<ApiResponse<MitraHomeDataSummaryResponse>> => {
  return apiClient.get<ApiResponse<MitraHomeDataSummaryResponse>>(
    "/api/mitra/home/data-summary",
    {
      params: { period },
      signal,
    },
  );
};
