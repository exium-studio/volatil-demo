import { queryClient } from "@/shared/libs/tanstack-query/query.client";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";

export const invalidateMitraDataRequestCatalog = () => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.mitra.dataRequest.all,
  });
};

export const invalidateDataRequestCatalog = invalidateMitraDataRequestCatalog;
