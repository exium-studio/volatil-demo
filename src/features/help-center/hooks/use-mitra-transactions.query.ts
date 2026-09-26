// src/features/help-center/hooks/use-mitra-transactions.query.ts

// src\features\help-center\hooks\use-mitra-transactions.query.ts

// src\features\help-center\hooks\use-mitra-transactions.query.ts

import { mitraTransactionService } from "@/features/help-center/services/mitra.transaction.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

export const useMitraTransactionsQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.mitra.helpCenter.transactions(),
    queryFn: ({ signal }) => mitraTransactionService.getTransactions(signal),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    transactions: query.data ?? [],
  };
};
