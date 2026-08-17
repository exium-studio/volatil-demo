// src/features/mitra/data-request/api/mitra.data-request-filter.api.ts

import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
  FilterKelurahanParams,
  FilterOptionItem,
  FilterOptionsResponse,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

const GITHUB_WILAYAH_BASE_URLS = [
  "https://www.emsifa.com/api-wilayah-indonesia/api",
  "https://emsifa.github.io/api-wilayah-indonesia/api",
];

const fetchWilayahJson = async <T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> => {
  for (const baseUrl of GITHUB_WILAYAH_BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}/${endpoint}`, { signal });
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // Try next fallback base URL
    }
  }
  throw new Error(`Failed to fetch ${endpoint} from Wilayah Indonesia API`);
};

// In-memory cache for mapping names to GitHub static API IDs
let cachedProvinces: Array<{ id: string; name: string }> | null = null;
const cachedRegencies = new Map<
  string,
  Array<{ id: string; province_id: string; name: string }>
>();
const cachedDistricts = new Map<
  string,
  Array<{ id: string; regency_id: string; name: string }>
>();

export const fetchFilterOptionsBasisApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
    "/mitra/data-request/filter-options/basis",
    { signal },
  );
  return response.data ?? { data: [] };
};

export const fetchFilterOptionsTemaApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
    "/mitra/data-request/filter-options/tema",
    { signal },
  );
  return response.data ?? { data: [] };
};

export const fetchFilterOptionsProvinsiApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const provinces = await fetchWilayahJson<Array<{ id: string; name: string }>>(
    "provinces.json",
    signal,
  );
  cachedProvinces = provinces;

  const data: FilterOptionItem[] = provinces.map((p) => ({
    label: p.name,
    value: p.name,
  }));
  return { data };
};

export const fetchFilterOptionsKabupatenApi = async (
  params?: FilterKabupatenParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  if (!params?.provinsiId) {
    return { data: [] };
  }

  if (!cachedProvinces) {
    cachedProvinces = await fetchWilayahJson<
      Array<{ id: string; name: string }>
    >("provinces.json", signal);
  }

  const provNameOrId = params.provinsiId.trim().toUpperCase();
  const matchedProv = cachedProvinces.find(
    (p) => p.id === provNameOrId || p.name.toUpperCase() === provNameOrId,
  );

  if (!matchedProv) {
    return { data: [] };
  }

  const regencies = await fetchWilayahJson<
    Array<{ id: string; province_id: string; name: string }>
  >(`regencies/${matchedProv.id}.json`, signal);

  cachedRegencies.set(matchedProv.id, regencies);

  const data: FilterOptionItem[] = regencies.map((r) => ({
    label: r.name,
    value: r.name,
  }));
  return { data };
};

export const fetchFilterOptionsKecamatanApi = async (
  params?: FilterKecamatanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  if (!params?.kabupatenId) {
    return { data: [] };
  }

  const kabNameOrId = params.kabupatenId.trim().toUpperCase();
  let targetRegId: string | undefined;

  for (const [, regList] of cachedRegencies.entries()) {
    const found = regList.find(
      (r) => r.id === kabNameOrId || r.name.toUpperCase() === kabNameOrId,
    );
    if (found) {
      targetRegId = found.id;
      break;
    }
  }

  if (!targetRegId) {
    return { data: [] };
  }

  const districts = await fetchWilayahJson<
    Array<{ id: string; regency_id: string; name: string }>
  >(`districts/${targetRegId}.json`, signal);

  cachedDistricts.set(targetRegId, districts);

  const data: FilterOptionItem[] = districts.map((d) => ({
    label: d.name,
    value: d.name,
  }));
  return { data };
};

export const fetchFilterOptionsKelurahanApi = async (
  params?: FilterKelurahanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  if (!params?.kecamatanId) {
    return { data: [] };
  }

  const kecNameOrId = params.kecamatanId.trim().toUpperCase();
  let targetDistId: string | undefined;

  for (const [, distList] of cachedDistricts.entries()) {
    const found = distList.find(
      (d) => d.id === kecNameOrId || d.name.toUpperCase() === kecNameOrId,
    );
    if (found) {
      targetDistId = found.id;
      break;
    }
  }

  if (!targetDistId) {
    return { data: [] };
  }

  const villages = await fetchWilayahJson<
    Array<{ id: string; district_id: string; name: string }>
  >(`villages/${targetDistId}.json`, signal);

  const data: FilterOptionItem[] = villages.map((v) => ({
    label: v.name,
    value: v.name,
  }));
  return { data };
};
