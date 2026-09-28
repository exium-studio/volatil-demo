// src/shared/types/use-infinite-query.type.ts

import type { PaginatedParams } from "@/shared/types/common-response.type";
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions as TanStackInfiniteQueryOptions,
} from "@tanstack/react-query";

export type InfiniteQueryFetcherResponse<TItem> = {
  items: TItem[];
  total: number;
  page?: number;
  pageSize?: number;
  unreadCount?: number;
};

export type UseInfiniteQueryOptions<
  TItem,
  TParams extends PaginatedParams = PaginatedParams,
> = {
  queryKey: QueryKey;
  fetcher: (
    params: TParams & { page: number; pageSize: number; signal?: AbortSignal },
  ) => Promise<InfiniteQueryFetcherResponse<TItem>>;
  params?: TParams;
  pageSize?: number;
  initialPage?: number;
  staleTime?: number;
  enabled?: boolean;
  queryOptions?: Omit<
    TanStackInfiniteQueryOptions<
      InfiniteQueryFetcherResponse<TItem>,
      Error,
      InfiniteData<InfiniteQueryFetcherResponse<TItem>, number>,
      QueryKey,
      number
    >,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >;
};
