// src/features/mitra/home/api/mitra.home.financial-flow.api.ts

import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type { MitraHomeFinancialFlowResponse } from "@/features/mitra/home/types/mitra.home.financial-flow.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraFinancialFlowApi = async (
  period: MitraHomePeriod = "all",
  signal?: AbortSignal,
): Promise<ApiResponse<MitraHomeFinancialFlowResponse>> => {
  return apiClient.get<ApiResponse<MitraHomeFinancialFlowResponse>>(
    "/api/mitra/home/financial-flow",
    {
      params: { period },
      signal,
    },
  );
};
