// src/features/internal/statistik-pesanan/hooks/use-internal-transaction-statistic.query.ts

import {
  getInternalTransactionDetail,
  getInternalTransactions,
  getInternalTransactionStatistics,
} from "@/features/internal/statistik-pesanan/services/internal.transaction-statistic.service";
import type {
  InternalTransactionItem,
  InternalTransactionListResponse,
  InternalTransactionQueryParams,
  InternalTransactionStatistics,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const useInternalTransactionStatisticsQuery = () => {
  const query = useQuery<InternalTransactionStatistics>({
    queryKey: ["internal", "transactions", "statistics"],
    queryFn: ({ signal }) => getInternalTransactionStatistics(signal),
  });

  return {
    ...query,
    statistics: query.data ?? {
      activeOrders: 0,
      settledTransactions: 0,
      netWorth: 0,
    },
  };
};

export const useInternalTransactionsQuery = (
  params: InternalTransactionQueryParams,
) => {
  const query = useQuery<InternalTransactionListResponse>({
    queryKey: ["internal", "transactions", params],
    queryFn: ({ signal }) => getInternalTransactions(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    transactions: query.data ?? {
      items: [],
      pagination: createPaginationMeta(params.page, params.pageSize, 0),
    },
  };
};

export const useInternalTransactionDetailQuery = (id: string) => {
  return useQuery<InternalTransactionItem | null>({
    queryKey: ["internal", "transactions", "detail", id],
    queryFn: ({ signal }) => getInternalTransactionDetail(id, signal),
    enabled: Boolean(id),
  });
};
