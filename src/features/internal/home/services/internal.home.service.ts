// src/features/internal/home/services/internal.home.service.ts

import { fetchInternalHomeDataApi } from "@/features/internal/home/api/internal.home.api";
import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyInternalDataList,
  dummyInternalDataSummary,
  dummyInternalOrderSummary,
  dummyInternalServiceRates,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";

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
    const response = await fetchInternalHomeDataApi(period, signal);
    return response.data ?? fallbackInternalHomeData;
  } catch {
    return fallbackInternalHomeData;
  }
};
