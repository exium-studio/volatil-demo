// src/features/mitra/data-request/services/mitra.data-request-filter.service.ts

import {
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

export const getFilterOptionsTema = async (): Promise<FilterOptionsResponse> => {
  return {
    data: DUMMY_FILTER_OPTIONS_TEMA,
  };
};

export const getFilterOptionsProvinsi = async (): Promise<FilterOptionsResponse> => {
  return {
    data: DUMMY_FILTER_OPTIONS_PROVINSI,
  };
};

export const getFilterOptionsKabupaten = async (
  _params?: FilterKabupatenParams,
): Promise<FilterOptionsResponse> => {
  return {
    data: DUMMY_FILTER_OPTIONS_KABUPATEN,
  };
};

export const getFilterOptionsKecamatan = async (
  _params?: FilterKecamatanParams,
): Promise<FilterOptionsResponse> => {
  return {
    data: DUMMY_FILTER_OPTIONS_KECAMATAN,
  };
};
