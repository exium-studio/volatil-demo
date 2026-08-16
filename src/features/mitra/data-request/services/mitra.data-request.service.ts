// src/features/mitra/data-request/services/mitra.data-request.service.ts

import {
  fetchIgtByAoiApi,
  fetchIgtByUploadedAoiApi,
  fetchIgtCatalogApi,
  fetchIgtGeometryByIdApi,
} from "@/features/mitra/data-request/api/mitra.data-request.api";
import type { MitraDataRequestGetCatalogParams } from "@/features/mitra/data-request/api/mitra.data-request.api";
import type {
  IgtDataItem,
  MitraDataRequestIgtDataItem,
} from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { MitraDataRequestIgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import {
  DUMMY_IGT_ITEMS,
  dummyIgtData,
} from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import type GeoJSON from "geojson";

export type { MitraDataRequestGetCatalogParams };

export async function getIgtCatalog(
  params?: MitraDataRequestGetCatalogParams,
  signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  try {
    const response = await fetchIgtCatalogApi(params, signal);
    return response.data ?? dummyIgtData;
  } catch (error) {
    console.warn("getIgtCatalog API error, falling back to dummy data:", error);
    return dummyIgtData;
  }
}

export async function getIgtByAoi(
  geometry: GeoJSON.Polygon,
  signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataItem[]> {
  try {
    const response = await fetchIgtByAoiApi(geometry, signal);
    return response.data ?? DUMMY_IGT_ITEMS;
  } catch (error) {
    console.warn("getIgtByAoi API error, falling back to dummy data:", error);
    return DUMMY_IGT_ITEMS;
  }
}

export async function fetchMitraIgtByAoi(
  geometry: GeoJSON.Polygon,
): Promise<IgtDataItem[]> {
  return getIgtByAoi(geometry);
}

export async function getIgtByUploadedAoi(
  file: File,
  signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  try {
    const response = await fetchIgtByUploadedAoiApi(file, signal);
    return response.data ?? dummyIgtData;
  } catch (error) {
    console.warn(
      "getIgtByUploadedAoi API error, falling back to dummy data:",
      error,
    );
    return dummyIgtData;
  }
}

export async function getIgtGeometryById(
  id: string,
  layerName: string,
  wfsUrl: string,
  signal?: AbortSignal,
): Promise<GeoJSON.FeatureCollection> {
  return fetchIgtGeometryByIdApi(id, layerName, wfsUrl, signal);
}
