// src/features/internal/home/api/internal.home.api.ts

import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalHomeDataApi = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalHomeDataResponse>> => {
  return apiClient.get<ApiResponse<InternalHomeDataResponse>>(
    "/api/internal/home",
    {
      params: { period },
      signal,
    },
  );
};
