// src/features/user-guide/hooks/use-user-guides.query.ts

import { userGuideService } from "@/features/user-guide/services/user-guide.service";
import type {
  UserGuideItem,
  UserGuideQueryParams,
} from "@/features/user-guide/types/user-guide.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

export const useUserGuidesQuery = (params?: UserGuideQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.userGuide.list(params),
    queryFn: ({ signal }) => userGuideService.getGuides(params, signal),
    staleTime: 1000 * 60 * 5,
  });

  const rawGuides = query.data?.items;
  const guides: UserGuideItem[] = Array.isArray(rawGuides)
    ? rawGuides
    : Array.isArray(query.data)
      ? (query.data as unknown as UserGuideItem[])
      : [];

  return {
    guides,
    total: query.data?.total ?? guides.length,
    totalPages: query.data?.totalPages ?? 1,
    page: query.data?.page ?? 1,
    limit: query.data?.limit ?? 10,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useUserGuideDetailQuery = (id: string) => {
  return useQuery<UserGuideItem | null>({
    queryKey: queryKeys.userGuide.detail(id),
    queryFn: ({ signal }) => userGuideService.getGuideById(id, signal),
    enabled: Boolean(id),
  });
};
