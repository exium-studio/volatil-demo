// src/features/mitra/home/hooks/use-mitra-home.query.ts

import type {
  MitraHomeDataSummaryResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  EMPTY_SUMMARY,
  getMitraHomeData,
} from "@/features/mitra/home/services/mitra.home.service";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useMitraHomeData = (period: MitraHomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.mitra.home.data(period),
    queryFn: ({ signal }) => getMitraHomeData(period, signal),
  });

  const homeData = query.data ?? dummyMitraHomeData;

  const dataSummary = useMemo<MitraHomeDataSummaryResponse>(() => {
    if (!homeData?.dataSummary) return EMPTY_SUMMARY;
    if ("field" in homeData.dataSummary && "area" in homeData.dataSummary) {
      return homeData.dataSummary as unknown as MitraHomeDataSummaryResponse;
    }
    if (period in homeData.dataSummary && homeData.dataSummary[period]) {
      return homeData.dataSummary[period];
    }
    return homeData.dataSummary.all ?? EMPTY_SUMMARY;
  }, [homeData, period]);

  const financialFlow = useMemo(() => {
    if (!homeData?.financialFlow) return [];
    if (Array.isArray(homeData.financialFlow)) {
      return homeData.financialFlow;
    }
    if (
      period in homeData.financialFlow &&
      Array.isArray(homeData.financialFlow[period])
    ) {
      return homeData.financialFlow[period];
    }
    return homeData.financialFlow.all ?? [];
  }, [homeData, period]);

  const cartSummary = useMemo(() => {
    return (
      homeData?.cartSummary ?? {
        totalField: 0,
        totalArea: 0,
        totalIgtData: 0,
        subtotalPrice: 0,
      }
    );
  }, [homeData]);

  const lastTransactions = useMemo(() => {
    return homeData?.lastTransactions ?? [];
  }, [homeData]);

  return {
    ...query,
    homeData,
    dataSummary,
    financialFlow,
    cartSummary,
    lastTransactions,
  };
};
