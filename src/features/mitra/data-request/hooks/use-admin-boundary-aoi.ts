// src\features\mitra\data-request\hooks\use-admin-boundary-aoi.ts

// src\features\mitra\data-request\hooks\use-admin-boundary-aoi.ts

import { fetchAdminBoundaryPolygon } from "@/features/mitra/data-request/api/mitra.data-request-admin-boundary.api";
import type { AdministrativeSelection } from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { useMemo } from "react";


/**
 * Resolves the deepest selected administrative level into level + name along with parent hierarchy.
 * Priority: kelurahan -> kecamatan -> kabupaten -> provinsi.
 */
export const getDeepestAdministrativeSelection = (
  filters?: FilterAdministrativeAreaValues,
): AdministrativeSelection | null => {
  if (!filters) return null;

  const prov = (filters.WADMPR ?? filters.wadmpr)?.value?.trim();
  const kab = (filters.WADMKK ?? filters.wadmkk)?.value?.trim();
  const kec = (filters.WADMKC ?? filters.wadmkc)?.value?.trim();
  const kel = (filters.WADMKD ?? filters.wadmkd)?.value?.trim();

  if (kel) {
    return {
      level: "kelurahan",
      name: kel,
      provinsi: prov,
      kabupaten: kab,
      kecamatan: kec,
      kelurahan: kel,
    };
  }

  if (kec) {
    return {
      level: "kecamatan",
      name: kec,
      provinsi: prov,
      kabupaten: kab,
      kecamatan: kec,
    };
  }

  if (kab) {
    return {
      level: "kabupaten",
      name: kab,
      provinsi: prov,
      kabupaten: kab,
    };
  }

  if (prov) {
    return {
      level: "provinsi",
      name: prov,
      provinsi: prov,
    };
  }

  return null;
};

/**
 * Custom hook to resolve administrative filter selections into a GeoJSON Polygon AOI via WFS.
 * Uses cascading strict matching on all selected administrative levels to return exactly 1 boundary feature.
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
    queryKey: queryKeys.mitra.dataRequest.adminBoundary(
      selection
        ? `${selection.level}:${selection.provinsi ?? ""}:${selection.kabupaten ?? ""}:${selection.kecamatan ?? ""}:${selection.kelurahan ?? ""}`
        : `${level}:${name}`,
    ),
    queryFn: ({ signal }) => {
      if (!selection) return Promise.resolve(null);
      return fetchAdminBoundaryPolygon({
        level: selection.level,
        name: selection.name,
        provinsi: selection.provinsi,
        kabupaten: selection.kabupaten,
        kecamatan: selection.kecamatan,
        kelurahan: selection.kelurahan,
        signal,
      });
    },
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000,
    retry: false,
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

