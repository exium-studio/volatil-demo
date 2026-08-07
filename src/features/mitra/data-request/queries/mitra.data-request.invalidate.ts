// src/features/mitra/data-request/queries/mitra.data-request.invalidate.ts

import { queryClient } from "@/shared/libs/tanstack-query/query.client";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";

export const invalidateMitraDataRequestCatalog = () => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.dataRequest.all,
  });
};

export const invalidateDataRequestCatalog = invalidateMitraDataRequestCatalog;
