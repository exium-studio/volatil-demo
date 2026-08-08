// src/features/mitra/home/hooks/use-mitra-home.query.ts

import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { getMitraHomeData } from "@/features/mitra/home/services/mitra.home.api";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

export const useMitraHomeData = (period: MitraHomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.mitra.home.data(period),
    queryFn: ({ signal }) => getMitraHomeData(period, signal),
  });

  const homeData = query.data ?? dummyMitraHomeData;

  return {
    ...query,
    homeData,
    dataSummary: homeData.dataSummary[period],
    financialFlow: homeData.financialFlow[period],
    cartSummary: homeData.cartSummary,
    lastTransactions: homeData.lastTransactions,
  };
};
