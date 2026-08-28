// src/features/internal/home/services/internal.home.service.ts

import { fetchInternalHomeDataApi } from "@/features/internal/home/api/internal.home.api";
import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyIgtBasis,
  dummyIgtPublicationStatus,
  dummyMitraRegistration,
  dummyInternalServiceRates,
  dummyInternalTrends,
  dummyTopMitraList,
  dummyTopIgtLayers,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const fallbackInternalHomeData: InternalHomeDataResponse = {
  igtBasis: dummyIgtBasis,
  igtPublicationStatus: dummyIgtPublicationStatus,
  mitraRegistration: dummyMitraRegistration,
  serviceRates: dummyInternalServiceRates,
  acquisitionTrends: dummyInternalTrends,
  topMitraList: dummyTopMitraList,
  topIgtLayers: dummyTopIgtLayers,
};

const emptyInternalHomeData: InternalHomeDataResponse = {
  igtBasis: { field: 0, area: 0 },
  igtPublicationStatus: { active: 0, inactive: 0 },
  mitraRegistration: { active: 0, pendingVerification: 0 },
  serviceRates: [],
  acquisitionTrends: {
    "1d": [],
    "1w": [],
    "1m": [],
    "1y": [],
    all: [],
  },
  topMitraList: [],
  topIgtLayers: [],
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
