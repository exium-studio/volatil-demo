// src/features/mitra/data-request/services/mitra.data-request-filter.service.ts

import {
  DUMMY_FILTER_OPTIONS_BASIS,
  DUMMY_FILTER_OPTIONS_KABUPATEN,
  DUMMY_FILTER_OPTIONS_KECAMATAN,
  DUMMY_FILTER_OPTIONS_PROVINSI,
  DUMMY_FILTER_OPTIONS_TEMA,
} from "@/features/mitra/data-request/services/mitra.data-request-filter.dummy";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
  FilterOptionsResponse,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";

export const getFilterOptionsBasis =
  async (): Promise<FilterOptionsResponse> => {
    return {
      data: DUMMY_FILTER_OPTIONS_BASIS,
    };
  };

export const getFilterOptionsTema =
  async (): Promise<FilterOptionsResponse> => {
    return {
      data: DUMMY_FILTER_OPTIONS_TEMA,
    };
  };

export const getFilterOptionsProvinsi =
  async (): Promise<FilterOptionsResponse> => {
    return {
      data: DUMMY_FILTER_OPTIONS_PROVINSI,
    };
  };

export const getFilterOptionsKabupaten = async (
  params?: FilterKabupatenParams,
): Promise<FilterOptionsResponse> => {
  // Simulate scoped fetch — in production this passes provinsiId to the API
  const all = DUMMY_FILTER_OPTIONS_KABUPATEN;
  const filtered = params?.provinsiId
    ? all.filter((_, i) => i % 3 === (params.provinsiId!.length % 3))
    : all;
  return { data: filtered };
};

export const getFilterOptionsKecamatan = async (
  params?: FilterKecamatanParams,
): Promise<FilterOptionsResponse> => {
  // Simulate scoped fetch — in production this passes kabupatenId to the API
  const all = DUMMY_FILTER_OPTIONS_KECAMATAN;
  const filtered = params?.kabupatenId
    ? all.filter((_, i) => i % 4 === (params.kabupatenId!.length % 4))
    : all;
  return { data: filtered };
};
