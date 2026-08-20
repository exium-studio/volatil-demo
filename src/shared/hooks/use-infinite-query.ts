// src/shared/hooks/use-infinite-query.ts

import type { PaginatedParams } from "@/shared/types/common-response.type";
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions as TanStackInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useInfiniteQuery as useTanStackInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

export const useInfiniteQuery = <
  TItem,
  TParams extends PaginatedParams = PaginatedParams,
>(
  options: UseInfiniteQueryOptions<TItem, TParams>,
) => {
  // Config
  const {
    queryKey,
    fetcher,
    params,
    pageSize = 10,
    initialPage = 1,
    staleTime = 60 * 1000,
    enabled = true,
    queryOptions,
  } = options;

  // Query
  const query = useTanStackInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = initialPage, signal }) => {
      const mergedParams = {
        ...(params as TParams),
        page: pageParam,
        pageSize,
        signal,
      };
      return fetcher(mergedParams);
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (sum, page) => sum + (page.items?.length ?? 0),
        0,
      );
      if (loadedCount >= lastPage.total || lastPage.items.length === 0) {
        return undefined;
      }
      return allPages.length + initialPage;
    },
    staleTime,
    enabled,
    ...queryOptions,
  });

  // Derived Values
  const items = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.items ?? []) ?? [];
  }, [query.data]);

  const total = query.data?.pages[0]?.total ?? 0;
  const unreadCount = query.data?.pages[0]?.unreadCount;

  return {
    ...query,
    items,
    total,
    unreadCount,
  };
};
