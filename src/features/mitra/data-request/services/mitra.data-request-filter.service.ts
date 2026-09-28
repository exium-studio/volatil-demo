import {
  fetchFilterOptionsBasisApi,
  fetchFilterOptionsKabupatenApi,
  fetchFilterOptionsKecamatanApi,
  fetchFilterOptionsKelurahanApi,
  fetchFilterOptionsProvinsiApi,
  fetchFilterOptionsTemaApi,
} from "@/features/mitra/data-request/api/mitra.data-request-filter.api";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
  FilterKelurahanParams,
  FilterOptionsResponse,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";

export const getFilterOptionsBasis = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsBasisApi(signal);
};

export const getFilterOptionsTema = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsTemaApi(signal);
};

export const getFilterOptionsProvinsi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsProvinsiApi(signal);
};

export const getFilterOptionsKabupaten = async (
  params?: FilterKabupatenParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsKabupatenApi(params, signal);
};

export const getFilterOptionsKecamatan = async (
  params?: FilterKecamatanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsKecamatanApi(params, signal);
};

export const getFilterOptionsKelurahan = async (
  params?: FilterKelurahanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  return fetchFilterOptionsKelurahanApi(params, signal);
};
