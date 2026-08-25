// src/features/mitra/purchase-history/hooks/use-purchase-history.ts

import { getPurchaseHistory } from "@/features/mitra/purchase-history/services/purchase-history.service";
import type {
  PurchaseHistoryQueryParams,
  PurchaseHistoryResponse,
} from "@/features/mitra/purchase-history/types/purchase-history.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const usePurchaseHistoryQuery = (params: PurchaseHistoryQueryParams) => {
  const query = useQuery<PurchaseHistoryResponse>({
    queryKey: ["mitra", "purchase-history", params],
    queryFn: ({ signal }) => getPurchaseHistory(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    purchaseHistory: query.data ?? {
      items: [],
      pagination: createPaginationMeta(params.page, params.pageSize, 0),
    },
  };
};
