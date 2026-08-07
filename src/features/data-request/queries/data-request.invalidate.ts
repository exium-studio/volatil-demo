// src/features/data-request/queries/data-request.invalidate.ts

import { queryClient } from "@/shared/libs/tanstack-query/query.client";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";

export const invalidateDataRequestCatalog = () => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.dataRequest.all,
  });
};
