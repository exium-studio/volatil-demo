import type { PaginatedParams } from "@/shared/types/common-response.type";
import type {
  InfiniteQueryFetcherResponse,
  UseInfiniteQueryOptions,
} from "@/shared/types/use-infinite-query.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useInfiniteQuery as useTanStackInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type {
  InfiniteQueryFetcherResponse,
  UseInfiniteQueryOptions,
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
      if (loadedCount >= lastPage.total || isEmptyArray(lastPage.items)) {
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
