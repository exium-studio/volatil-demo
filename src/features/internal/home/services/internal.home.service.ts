import { fetchInternalHomeDataApi } from "@/features/internal/home/api/internal.home.api";
import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyInternalDataView,
  dummyInternalDataSummary,
  dummyInternalOrderSummary,
  dummyInternalServiceRates,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import type { InternalHomeDataSummaryResponse } from "@/features/internal/home/types/internal.home.data-summary.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const fallbackInternalHomeData: InternalHomeDataResponse = {
  dataSummary: dummyInternalDataSummary,
  serviceRates: dummyInternalServiceRates,
  orderSummary: dummyInternalOrderSummary,
  dataList: dummyInternalDataView,
};

const EMPTY_INTERNAL_SUMMARY: InternalHomeDataSummaryResponse = {
  field: { active: 0, inactive: 0 },
  area: { active: 0, inactive: 0 },
};

const emptyInternalHomeData: InternalHomeDataResponse = {
  dataSummary: {
    "1d": EMPTY_INTERNAL_SUMMARY,
    "1w": EMPTY_INTERNAL_SUMMARY,
    "1m": EMPTY_INTERNAL_SUMMARY,
    "1y": EMPTY_INTERNAL_SUMMARY,
    all: EMPTY_INTERNAL_SUMMARY,
  },
  serviceRates: [],
  orderSummary: {
    activeOrders: 0,
    completedOrders: 0,
    igtRequests: 0,
    totalRevenue: 0,
  },
  dataList: [],
};

export const getInternalHomeData = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<InternalHomeDataResponse> => {
  try {
    const response = await fetchInternalHomeDataApi(period, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled() ? fallbackInternalHomeData : emptyInternalHomeData;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return fallbackInternalHomeData;
    }
    throw error;
  }
};
