// src/features/mitra/data-request/hooks/use-admin-boundary-aoi.ts

import { fetchAdminBoundaryPolygon } from "@/features/mitra/data-request/api/mitra.data-request-admin-boundary.api";
import type { AdminBoundaryLevel } from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { useMemo } from "react";

/**
 * Resolves the deepest selected administrative level into level + name.
 * Priority: kelurahan -> kecamatan -> kabupaten -> provinsi.
 */
export const getDeepestAdministrativeSelection = (
  filters?: FilterAdministrativeAreaValues,
): { level: AdminBoundaryLevel; name: string } | null => {
  if (!filters) return null;

  const kel = filters.WADMKD ?? filters.wadmkd;
  if (kel?.value && kel.value.trim() !== "") {
    return { level: "kelurahan", name: kel.value.trim() };
  }

  const kec = filters.WADMKC ?? filters.wadmkc;
  if (kec?.value && kec.value.trim() !== "") {
    return { level: "kecamatan", name: kec.value.trim() };
  }

  const kab = filters.WADMKK ?? filters.wadmkk;
  if (kab?.value && kab.value.trim() !== "") {
    return { level: "kabupaten", name: kab.value.trim() };
  }

  const prov = filters.WADMPR ?? filters.wadmpr;
  if (prov?.value && prov.value.trim() !== "") {
    return { level: "provinsi", name: prov.value.trim() };
  }

  return null;
};

/**
 * Custom hook to resolve administrative filter selections into a GeoJSON Polygon AOI via WFS.
 */
export const useAdminBoundaryAoi = (
  filters?: FilterAdministrativeAreaValues,
  options?: { enabled?: boolean },
) => {
  // Derived Values
  const selection = useMemo(
    () => getDeepestAdministrativeSelection(filters),
    [filters],
  );

  const level = selection?.level ?? "";
  const name = selection?.name ?? "";
  const isEnabled = Boolean(selection && (options?.enabled ?? true));

  // Queries
  const { data, isLoading, isFetching, error, isError, refetch } = useQuery<
    GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null,
    Error
  >({
    queryKey: queryKeys.mitra.dataRequest.adminBoundary(level, name),
    queryFn: ({ signal }) => {
      if (!selection) return Promise.resolve(null);
      return fetchAdminBoundaryPolygon({
        level: selection.level,
        name: selection.name,
        signal,
      });
    },
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000,
  });

  return {
    aoiPolygon: data ?? null,
    selection,
    isLoading: isEnabled && (isLoading || isFetching),
    isError,
    error,
    refetch,
  };
};
