// src/shared/hooks/use-paginated-query.ts

import type {
  PaginatedParams,
  PaginatedResponse,
} from "@/shared/types/common-response.type";
import {
  keepPreviousData,
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

export type UsePaginatedQueryOptions<
  TItem,
  TParams extends PaginatedParams = PaginatedParams,
> = {
  queryKey: (params: TParams & { page: number; pageSize: number }) => QueryKey;
  fetcher: (
    params: TParams & { page: number; pageSize: number; signal?: AbortSignal },
  ) => Promise<PaginatedResponse<TItem>>;
  params?: TParams;
  initialPage?: number;
  initialPageSize?: number;
  staleTime?: number;
  enabled?: boolean;
  queryOptions?: Omit<
    UseQueryOptions<PaginatedResponse<TItem>, Error>,
    "queryKey" | "queryFn"
  >;
};

export const usePaginatedQuery = <
  TItem,
  TParams extends PaginatedParams = PaginatedParams,
>(
  options: UsePaginatedQueryOptions<TItem, TParams>,
) => {
  // Config & States
  const {
    queryKey,
    fetcher,
    params,
    initialPage = 1,
    initialPageSize = 10,
    staleTime = 60 * 1000,
    enabled = true,
    queryOptions,
  } = options;

  // States
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Combined Params
  const queryParams = {
    ...(params as TParams),
    page,
    pageSize,
  };

  // Query
  const query = useQuery({
    queryKey: queryKey(queryParams),
    queryFn: ({ signal }) => fetcher({ ...queryParams, signal }),
    placeholderData: keepPreviousData,
    staleTime,
    enabled,
    ...queryOptions,
  });

  // Derived Values
  const items = query.data?.items ?? [];
  const total = query.data?.pagination?.totalItems ?? 0;
  const totalPages = query.data?.pagination?.totalPages ?? 1;

  return {
    ...query,
    items,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
};
