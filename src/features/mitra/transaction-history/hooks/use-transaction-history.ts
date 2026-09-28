// src/features/mitra/transaction-history/hooks/use-transaction-history.ts

import { getTransactionHistory } from "@/features/mitra/transaction-history/services/transaction-history.service";
import type {
  TransactionHistoryQueryParams,
  TransactionHistoryResponse,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const useTransactionHistoryQuery = (
  params: TransactionHistoryQueryParams,
) => {
  const query = useQuery<TransactionHistoryResponse>({
    queryKey: ["mitra", "transaction-history", params],
    queryFn: ({ signal }) => getTransactionHistory(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    transactionHistory: query.data ?? {
      items: [],
      pagination: createPaginationMeta(params.page, params.pageSize, 0),
    },
  };
};
