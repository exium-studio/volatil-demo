// src/features/mitra/data-request/queries/use-mitra-data-request-filter.query.ts

import {
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

export const useFilterOptionsTema = () => {
  return useQuery({
    queryKey: ["filter-options-tema"],
    queryFn: getFilterOptionsTema,
  });
};

export const useFilterOptionsProvinsi = () => {
  return useQuery({
    queryKey: ["filter-options-provinsi"],
    queryFn: getFilterOptionsProvinsi,
  });
};

export const useFilterOptionsKabupaten = (params?: FilterKabupatenParams) => {
  return useQuery({
    queryKey: ["filter-options-kabupaten", params],
    queryFn: () => getFilterOptionsKabupaten(params),
  });
};

export const useFilterOptionsKecamatan = (params?: FilterKecamatanParams) => {
  return useQuery({
    queryKey: ["filter-options-kecamatan", params],
    queryFn: () => getFilterOptionsKecamatan(params),
  });
};
