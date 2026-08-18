import { fetchMitraHomeDataApi } from "@/features/mitra/home/api/mitra.home.api";
import type {
  MitraHomeDataResponse,
  MitraHomeDataSummaryResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_SUMMARY: MitraHomeDataSummaryResponse = {
  field: { active: 0, almostExpired: 0, expired: 0 },
  area: { active: 0, almostExpired: 0, expired: 0 },
};

const EMPTY_MITRA_HOME_DATA: MitraHomeDataResponse = {
  dataSummary: {
    "1d": EMPTY_SUMMARY,
    "1w": EMPTY_SUMMARY,
    "1m": EMPTY_SUMMARY,
    "1y": EMPTY_SUMMARY,
    all: EMPTY_SUMMARY,
  },
  financialFlow: {
    "1d": [],
    "1w": [],
    "1m": [],
    "1y": [],
    all: [],
  },
  cartSummary: {
    totalField: 0,
    totalArea: 0,
    totalIgtData: 0,
    subtotalPrice: 0,
  },
  lastTransactions: [],
};

export const getMitraHomeData = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<MitraHomeDataResponse> => {
  try {
    const response = await fetchMitraHomeDataApi(period, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled() ? dummyMitraHomeData : EMPTY_MITRA_HOME_DATA;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return dummyMitraHomeData;
    }
    throw error;
  }
};
