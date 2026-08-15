// src/features/mitra/data-request/api/mitra.data-request-filter.api.ts

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
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchFilterOptionsBasisApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
      "/mitra/data-request/filter-options/basis",
      { signal },
    );
    return response.data ?? { data: DUMMY_FILTER_OPTIONS_BASIS };
  } catch {
    return { data: DUMMY_FILTER_OPTIONS_BASIS };
  }
};

export const fetchFilterOptionsTemaApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
      "/mitra/data-request/filter-options/tema",
      { signal },
    );
    return response.data ?? { data: DUMMY_FILTER_OPTIONS_TEMA };
  } catch {
    return { data: DUMMY_FILTER_OPTIONS_TEMA };
  }
};

export const fetchFilterOptionsProvinsiApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
      "/mitra/data-request/filter-options/provinsi",
      { signal },
    );
    return response.data ?? { data: DUMMY_FILTER_OPTIONS_PROVINSI };
  } catch {
    return { data: DUMMY_FILTER_OPTIONS_PROVINSI };
  }
};

export const fetchFilterOptionsKabupatenApi = async (
  params?: FilterKabupatenParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
      "/mitra/data-request/filter-options/kabupaten",
      { params, signal },
    );
    return (
      response.data ?? {
        data: params?.provinsiId
          ? DUMMY_FILTER_OPTIONS_KABUPATEN.filter(
              (_, i) => i % 3 === (params.provinsiId!.length % 3),
            )
          : DUMMY_FILTER_OPTIONS_KABUPATEN,
      }
    );
  } catch {
    const all = DUMMY_FILTER_OPTIONS_KABUPATEN;
    const filtered = params?.provinsiId
      ? all.filter((_, i) => i % 3 === (params.provinsiId!.length % 3))
      : all;
    return { data: filtered };
  }
};

export const fetchFilterOptionsKecamatanApi = async (
  params?: FilterKecamatanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
      "/mitra/data-request/filter-options/kecamatan",
      { params, signal },
    );
    return (
      response.data ?? {
        data: params?.kabupatenId
          ? DUMMY_FILTER_OPTIONS_KECAMATAN.filter(
              (_, i) => i % 4 === (params.kabupatenId!.length % 4),
            )
          : DUMMY_FILTER_OPTIONS_KECAMATAN,
      }
    );
  } catch {
    const all = DUMMY_FILTER_OPTIONS_KECAMATAN;
    const filtered = params?.kabupatenId
      ? all.filter((_, i) => i % 4 === (params.kabupatenId!.length % 4))
      : all;
    return { data: filtered };
  }
};
