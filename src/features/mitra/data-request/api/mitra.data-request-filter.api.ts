// src/features/mitra/data-request/api/mitra.data-request-filter.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { ADMIN_BOUNDARY_WFS_CONFIG } from "@/features/mitra/data-request/constants/igt.config";
import type {
  FilterKabupatenParams,
  FilterKecamatanParams,
  FilterKelurahanParams,
  FilterOptionItem,
  FilterOptionsResponse,
} from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

const escapeCql = (val: string): string => val.trim().replace(/'/g, "''");

const extractAdminFeatureName = (
  props: GeoJSON.GeoJsonProperties,
  primaryKeys: string[],
): string => {
  if (!props) return "";
  for (const key of primaryKeys) {
    const val =
      props[key] ?? props[key.toLowerCase()] ?? props[key.toUpperCase()];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return "";
};

export const fetchFilterOptionsBasisApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
    "/api/mitra/data-request/filter-options/basis",
    { signal },
  );
  return response.data ?? { data: [] };
};

export const fetchFilterOptionsTemaApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>(
    "/api/mitra/data-request/filter-options/tema",
    { signal },
  );
  return response.data ?? { data: [] };
};

/**
 * Fetches unique Provinsi options directly from GeoServer WFS BATAS_ADMIN_PROVINSI layer.
 */
export const fetchFilterOptionsProvinsiApi = async (
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  const config = ADMIN_BOUNDARY_WFS_CONFIG.provinsi;
  const res = await fetchWfs({
    typeName: config.typeName,
    wfsUrl: config.wfsUrl,
    version: "2.0.0",
    propertyName: config.attributeKey,
    maxFeatures: 100,
    signal,
  });

  const keys = [
    config.attributeKey,
    "WADMPR",
    "wadmpr",
    "provinsi",
    "NAMA",
    "nama",
  ];
  const uniqueNames = Array.from(
    new Set(
      res.features
        .map((f) => extractAdminFeatureName(f.properties, keys))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "id"));

  const data: FilterOptionItem[] = uniqueNames.map((name) => ({
    label: name,
    value: name,
  }));
  return { data };
};

/**
 * Fetches unique Kabupaten/Kota options directly from GeoServer WFS BATAS_ADMIN_KOTAKAB layer.
 * Filtered strictly by parent Provinsi (WADMPR) when provided.
 */
export const fetchFilterOptionsKabupatenApi = async (
  params?: FilterKabupatenParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  if (!params?.provinsiId) {
    return { data: [] };
  }

  const config = ADMIN_BOUNDARY_WFS_CONFIG.kabupaten;
  const cleanProv = escapeCql(params.provinsiId);
  const cqlFilter = cleanProv ? `WADMPR ILIKE '${cleanProv}'` : undefined;

  const res = await fetchWfs({
    typeName: config.typeName,
    wfsUrl: config.wfsUrl,
    version: "2.0.0",
    cqlFilter,
    propertyName: `${config.attributeKey},WADMPR`,
    maxFeatures: 1000,
    signal,
  });

  const keys = [
    config.attributeKey,
    "WADMKK",
    "wadmkk",
    "kabupaten",
    "kota",
    "NAMA",
    "nama",
  ];
  const uniqueNames = Array.from(
    new Set(
      res.features
        .map((f) => extractAdminFeatureName(f.properties, keys))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "id"));

  const data: FilterOptionItem[] = uniqueNames.map((name) => ({
    label: name,
    value: name,
  }));
  return { data };
};

/**
 * Fetches unique Kecamatan options directly from GeoServer WFS BATAS_ADMIN_KECAMATAN layer.
 * Filtered strictly by parent Provinsi (WADMPR) and Kabupaten (WADMKK) when provided.
 */
export const fetchFilterOptionsKecamatanApi = async (
  params?: FilterKecamatanParams,
  signal?: AbortSignal,
): Promise<FilterOptionsResponse> => {
  if (!params?.kabupatenId) {
    return { data: [] };
  }

  const config = ADMIN_BOUNDARY_WFS_CONFIG.kecamatan;
  const clauses: string[] = [];

  if (params.provinsiId) {
    const cleanProv = escapeCql(params.provinsiId);
    if (cleanProv) clauses.push(`WADMPR ILIKE '${cleanProv}'`);
  }

  const cleanKab = escapeCql(params.kabupatenId);
  if (cleanKab) {
    clauses.push(`WADMKK ILIKE '${cleanKab}'`);
  }

  const cqlFilter = clauses.length > 0 ? clauses.join(" AND ") : undefined;

  const res = await fetchWfs({
    typeName: config.typeName,
    wfsUrl: config.wfsUrl,
    version: "2.0.0",
    cqlFilter,
    propertyName: `${config.attributeKey},WADMKK`,
    maxFeatures: 2000,
    signal,
  });

  const keys = [
    config.attributeKey,
    "WADMKC",
    "wadmkc",
    "kecamatan",
    "NAMA",
    "nama",
  ];
  const uniqueNames = Array.from(
    new Set(
      res.features
        .map((f) => extractAdminFeatureName(f.properties, keys))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "id"));

  const data: FilterOptionItem[] = uniqueNames.map((name) => ({
    label: name,
    value: name,
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

  const config = ADMIN_BOUNDARY_WFS_CONFIG.kelurahan;
  const cleanKec = escapeCql(params.kecamatanId);

  // Strategy 1: Strict match with kecamatan & parent kab/prov
  const strictClauses: string[] = [];
  if (params.provinsiId) {
    const cleanProv = escapeCql(params.provinsiId);
    if (cleanProv) strictClauses.push(`WADMPR ILIKE '${cleanProv}'`);
  }
  if (params.kabupatenId) {
    const cleanKab = escapeCql(params.kabupatenId);
    if (cleanKab) strictClauses.push(`WADMKK ILIKE '${cleanKab}'`);
  }
  if (cleanKec) {
    strictClauses.push(`WADMKC ILIKE '${cleanKec}'`);
  }

  let res = await fetchWfs({
    typeName: config.typeName,
    wfsUrl: config.wfsUrl,
    version: "2.0.0",
    cqlFilter:
      strictClauses.length > 0 ? strictClauses.join(" AND ") : undefined,
    propertyName: `${config.attributeKey},WADMKC`,
    maxFeatures: 5000,
    signal,
  }).catch(async (err) => {
    // If strict match fails, try relaxed match by only WADMKC or KECAMATAN
    console.warn(
      "Strict Kelurahan WFS query failed, retrying with relaxed filter:",
      err,
    );
    return fetchWfs({
      typeName: config.typeName,
      wfsUrl: config.wfsUrl,
      version: "2.0.0",
      cqlFilter: `WADMKC ILIKE '${cleanKec}'`,
      propertyName: `${config.attributeKey},WADMKC`,
      maxFeatures: 5000,
      signal,
    });
  });

  // Strategy 2: If strict query returned 0 features, try filtering purely by Kecamatan (in case WADMPR/WADMKK spelling differs)
  if (res.features.length === 0 && (params.provinsiId || params.kabupatenId)) {
    try {
      const relaxedRes = await fetchWfs({
        typeName: config.typeName,
        wfsUrl: config.wfsUrl,
        version: "2.0.0",
        cqlFilter: `WADMKC ILIKE '${cleanKec}'`,
        propertyName: `${config.attributeKey},WADMKC`,
        maxFeatures: 5000,
        signal,
      });
      if (relaxedRes.features.length > 0) {
        res = relaxedRes;
      }
    } catch {
      // Ignore relaxed failure
    }
  }

  const keys = [
    config.attributeKey,
    "NAMBOJ",
    "namboj",
    "NAMOBJ",
    "namobj",
    "WADMKD",
    "wadmkd",
    "kelurahan",
    "desa",
    "NAMA",
    "nama",
  ];
  const uniqueNames = Array.from(
    new Set(
      res.features
        .map((f) => extractAdminFeatureName(f.properties, keys))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "id"));

  if (uniqueNames.length === 0) {
    throw new Error(
      `Data kelurahan/desa untuk kecamatan "${params.kecamatanId}" tidak ditemukan atau belum dipublish di GeoServer.`,
    );
  }

  const data: FilterOptionItem[] = uniqueNames.map((name) => ({
    label: name,
    value: name,
  }));
  return { data };
};
