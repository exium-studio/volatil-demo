// src/shared/hooks/use-paginated-query.ts

import type { PaginatedParams } from "@/shared/types/common-response.type";
import type { UsePaginatedQueryOptions } from "@/shared/types/use-paginated-query.type";
<<<<<<< HEAD
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

export type { UsePaginatedQueryOptions };

=======
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
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
