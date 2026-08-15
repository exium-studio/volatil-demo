// src/features/mitra/data-request/queries/use-mitra-data-request-filter.query.ts

import {
  getFilterOptionsBasis,
  getFilterOptionsKabupaten,
  getFilterOptionsKecamatan,
  getFilterOptionsProvinsi,
  getFilterOptionsTema,
} from "@/features/mitra/data-request/services/mitra.data-request-filter.service";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { useQuery } from "@tanstack/react-query";

export const useFilterOptionsBasis = () => {
  return useQuery({
    queryKey: ["filter-options-basis"],
    queryFn: ({ signal }) => getFilterOptionsBasis(signal),
  });
};

export const useFilterOptionsTema = () => {
  return useQuery({
    queryKey: ["filter-options-tema"],
    queryFn: ({ signal }) => getFilterOptionsTema(signal),
  });
};

export const useFilterOptionsProvinsi = () => {
  return useQuery({
    queryKey: ["filter-options-provinsi"],
    queryFn: ({ signal }) => getFilterOptionsProvinsi(signal),
  });
};

export const useFilterOptionsKabupaten = (params?: FilterKabupatenParams) => {
  return useQuery({
    queryKey: ["filter-options-kabupaten", params],
    queryFn: ({ signal }) => getFilterOptionsKabupaten(params, signal),
    enabled: !!params?.provinsiId,
  });
};

export const useFilterOptionsKecamatan = (params?: FilterKecamatanParams) => {
  return useQuery({
    queryKey: ["filter-options-kecamatan", params],
    queryFn: ({ signal }) => getFilterOptionsKecamatan(params, signal),
    enabled: !!params?.kabupatenId,
  });
};
