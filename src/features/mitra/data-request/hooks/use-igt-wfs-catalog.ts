// src/features/mitra/data-request/hooks/use-igt-wfs-catalog.ts

import {
  fetchWfsCatalog,
  type FetchWfsCatalogParams,
} from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";
import { useQuery } from "@tanstack/react-query";

type UseIgtWfsCatalogParams = Omit<FetchWfsCatalogParams, "signal">;

/** TanStack Query wrapper for paginated WFS catalog fetch with parallel bidang/kawasan hit counts and in-memory caching. */
export const useIgtWfsCatalog = (params: UseIgtWfsCatalogParams) => {
  const query = useQuery({
    queryKey: ["igt-wfs-catalog", params],
    queryFn: ({ signal }) => fetchWfsCatalog({ ...params, signal }),
    placeholderData: (prev) => prev,
    staleTime: 10 * 60 * 1000, // 10 minutes memory cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection time
  });

  return {
    ...query,
    features: query.data?.features ?? [],
    totalFeatures: query.data?.totalFeatures ?? 0,
    bidangCount: query.data?.bidangCount ?? 0,
    kawasanCount: query.data?.kawasanCount ?? 0,
  };
};
