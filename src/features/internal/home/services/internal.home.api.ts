// src/features/internal/home/services/internal.home.api.ts

import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyInternalDataList,
  dummyInternalDataSummary,
  dummyInternalOrderSummary,
  dummyInternalServiceRates,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

const fallbackInternalHomeData: InternalHomeDataResponse = {
  dataSummary: dummyInternalDataSummary,
  serviceRates: dummyInternalServiceRates,
  orderSummary: dummyInternalOrderSummary,
  dataList: dummyInternalDataList,
};

export const getInternalHomeData = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<InternalHomeDataResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<InternalHomeDataResponse>>(
      "/internal/home",
      {
        params: { period },
        signal,
      },
    );
    return response.data ?? fallbackInternalHomeData;
  } catch {
    return fallbackInternalHomeData;
  }
};
