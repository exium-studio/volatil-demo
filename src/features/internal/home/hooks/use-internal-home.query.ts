// src/features/internal/home/hooks/use-internal-home.query.ts

import type { InternalHomeDataResponse } from "@/features/internal/home/types/internal.home.api.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { getInternalHomeData } from "@/features/internal/home/services/internal.home.service";
import {
  dummyInternalDataSummary,
  dummyInternalServiceRates,
  dummyInternalTrends,
  dummyTopMitraList,
  dummyTopIgtLayers,
  dummySystemHealth,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

const fallbackInternalHomeData: InternalHomeDataResponse = {
  dataSummary: dummyInternalDataSummary,
  serviceRates: dummyInternalServiceRates,
  acquisitionTrends: dummyInternalTrends,
  topMitraList: dummyTopMitraList,
  topIgtLayers: dummyTopIgtLayers,
  systemHealth: dummySystemHealth,
};

export const useInternalHomeData = (period: HomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.data(period),
    queryFn: ({ signal }) => getInternalHomeData(period, signal),
  });

  const homeData = query.data ?? fallbackInternalHomeData;

  return {
    ...query,
    homeData,
    dataSummary: homeData.dataSummary[period],
    serviceRates: homeData.serviceRates,
    acquisitionTrends: homeData.acquisitionTrends[period] ?? [],
    topMitraList: homeData.topMitraList,
    topIgtLayers: homeData.topIgtLayers,
    systemHealth: homeData.systemHealth,
  };
};
