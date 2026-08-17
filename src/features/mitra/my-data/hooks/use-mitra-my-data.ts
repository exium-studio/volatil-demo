// src/features/mitra/my-data/hooks/use-mitra-my-data.ts

import { getMyData } from "@/features/mitra/my-data/services/mitra.my-data.service";
import type {
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const useMitraMyDataQuery = (params: MyDataQueryParams) => {
  const query = useQuery<MyDataResponse>({
    queryKey: ["mitra", "my-data", params],
    queryFn: ({ signal }) => getMyData(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    myData: query.data ?? {
      items: [],
      pagination: createPaginationMeta(params.page, params.pageSize, 0),
    },
  };
};
