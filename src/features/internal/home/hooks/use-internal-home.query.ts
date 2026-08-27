// src/features/internal/home/hooks/use-internal-home.query.ts

import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { getInternalHomeData } from "@/features/internal/home/services/internal.home.service";
import {
  dummyInternalDataView,
  dummyInternalDataSummary,
  dummyInternalOrderSummary,
  dummyInternalServiceRates,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

const fallbackInternalHomeData = {
  dataSummary: dummyInternalDataSummary,
  serviceRates: dummyInternalServiceRates,
  orderSummary: dummyInternalOrderSummary,
  dataList: dummyInternalDataView,
};

export const useInternalHomeData = (period: MitraHomePeriod = "all") => {
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
    orderSummary: homeData.orderSummary,
    dataList: homeData.dataList,
  };
};
