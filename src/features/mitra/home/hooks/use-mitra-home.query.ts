// src/features/mitra/home/hooks/use-mitra-home.query.ts

// src\features\mitra\home\hooks\use-mitra-home.query.ts

// src\features\mitra\home\hooks\use-mitra-home.query.ts

import { getMitraDataAvailability } from "@/features/mitra/home/services/mitra.home.data-availability.service";
import {
  EMPTY_SUMMARY,
  getMitraDataSummary,
} from "@/features/mitra/home/services/mitra.home.data-summary.service";
import { getMitraCartSummary } from "@/features/mitra/home/services/mitra.home.cart-summary.service";
import { getMitraFinancialFlow } from "@/features/mitra/home/services/mitra.home.financial-flow.service";
import type { MitraHomeDataAvailabilityResponse } from "@/features/mitra/home/types/mitra.home.data-availability.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type { MitraHomeCartSummaryResponse } from "@/features/mitra/home/types/mitra.home.cart-summary.type";
import type { FinancialFlowItem } from "@/features/mitra/home/types/mitra.home.financial-flow.type";
import { dummyMitraDataAvailability } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { useQuery } from "@tanstack/react-query";

const emptyCartSummary: MitraHomeCartSummaryResponse = {
  totalField: 0,
  totalArea: 0,
  totalIgtData: 0,
  subtotalPrice: 0,
};

// 1. Hook Ketersediaan Data Spasial IGT
export const useMitraDataAvailabilityQuery = () => {
  const query = useQuery<MitraHomeDataAvailabilityResponse>({
    queryKey: queryKeys.mitra.home.dataAvailability(),
    queryFn: ({ signal }) => getMitraDataAvailability(signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    dataAvailability:
      query.data ??
      (isDummyDataEnabled()
        ? dummyMitraDataAvailability
        : { totalIgt: 0, bidang: 0, kawasan: 0 }),
  };
};

// 2. Hook Ringkasan Data Anda
export const useMitraDataSummaryQuery = (period: MitraHomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.mitra.home.dataSummary(period),
    queryFn: ({ signal }) => getMitraDataSummary(period, signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    dataSummary: query.data ?? EMPTY_SUMMARY,
  };
};

// 3. Hook Ringkasan Keranjang Pembelian
export const useMitraCartSummaryQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.mitra.home.cartSummary(),
    queryFn: ({ signal }) => getMitraCartSummary(signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    cartSummary: query.data ?? emptyCartSummary,
  };
};

// 4. Hook Statistik Alur Keuangan
export const useMitraFinancialFlowQuery = (period: MitraHomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.mitra.home.financialFlow(period),
    queryFn: ({ signal }) => getMitraFinancialFlow(period, signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    financialFlow: (query.data ?? []) as FinancialFlowItem[],
  };
};

// 5. Combined / Legacy Hook (for compatibility if needed)
export const useMitraHomeData = (period: MitraHomePeriod = "all") => {
  const availability = useMitraDataAvailabilityQuery();
  const summary = useMitraDataSummaryQuery(period);
  const cart = useMitraCartSummaryQuery();
  const flow = useMitraFinancialFlowQuery(period);

  const isLoading =
    availability.isLoading ||
    summary.isLoading ||
    cart.isLoading ||
    flow.isLoading;

  return {
    isLoading,
    dataAvailability: availability.dataAvailability,
    dataSummary: summary.dataSummary,
    cartSummary: cart.cartSummary,
    financialFlow: flow.financialFlow,
    refetchAll: () => {
      void availability.refetch();
      void summary.refetch();
      void cart.refetch();
      void flow.refetch();
    },
  };
};
