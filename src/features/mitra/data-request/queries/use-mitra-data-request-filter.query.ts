// src/features/mitra/data-request/queries/use-mitra-data-request-filter.query.ts

// src\features\mitra\data-request\queries\use-mitra-data-request-filter.query.ts

// src\features\mitra\data-request\queries\use-mitra-data-request-filter.query.ts

import {
  getFilterOptionsBasis,
  getFilterOptionsKabupaten,
  getFilterOptionsKecamatan,
  getFilterOptionsKelurahan,
  getFilterOptionsProvinsi,
  getFilterOptionsTema,
} from "@/features/mitra/data-request/services/mitra.data-request-filter.service";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
  FilterKelurahanParams,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { useQuery } from "@tanstack/react-query";

export const useFilterOptionsBasis = () => {
  return useQuery({
    queryKey: ["filter-options-basis"],
    queryFn: ({ signal }) => getFilterOptionsBasis(signal),
    retry: false,
  });
};

export const useFilterOptionsTema = () => {
  return useQuery({
    queryKey: ["filter-options-tema"],
    queryFn: ({ signal }) => getFilterOptionsTema(signal),
    retry: false,
  });
};

export const useFilterOptionsProvinsi = () => {
  return useQuery({
    queryKey: ["filter-options-provinsi"],
    queryFn: ({ signal }) => getFilterOptionsProvinsi(signal),
    retry: false,
  });
};

export const useFilterOptionsKabupaten = (params?: FilterKabupatenParams) => {
  return useQuery({
    queryKey: ["filter-options-kabupaten", params],
    queryFn: ({ signal }) => getFilterOptionsKabupaten(params, signal),
    enabled: !!params?.provinsiId,
    retry: false,
  });
};

export const useFilterOptionsKecamatan = (params?: FilterKecamatanParams) => {
  return useQuery({
    queryKey: ["filter-options-kecamatan", params],
    queryFn: ({ signal }) => getFilterOptionsKecamatan(params, signal),
    enabled: !!params?.kabupatenId,
    retry: false,
  });
};

export const useFilterOptionsKelurahan = (params?: FilterKelurahanParams) => {
  return useQuery({
    queryKey: ["filter-options-kelurahan", params],
    queryFn: ({ signal }) => getFilterOptionsKelurahan(params, signal),
    enabled: !!params?.kecamatanId,
    retry: false,
  });
};
