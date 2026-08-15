// src/features/mitra/data-request/services/mitra.data-request-filter.service.ts

import {
  fetchFilterOptionsBasisApi,
  fetchFilterOptionsKabupatenApi,
  fetchFilterOptionsKecamatanApi,
  fetchFilterOptionsProvinsiApi,
  fetchFilterOptionsTemaApi,
} from "@/features/mitra/data-request/api/mitra.data-request-filter.api";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
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
