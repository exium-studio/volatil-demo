<<<<<<< HEAD
// src/shared/types/use-paginated-query.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@/shared/types/common-response.type";
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

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
