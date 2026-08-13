import { getMyData } from "@/features/mitra/my-data/services/my-data.api";
import type {
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";
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
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
        totalPages: 0,
      },
    },
  };
};
