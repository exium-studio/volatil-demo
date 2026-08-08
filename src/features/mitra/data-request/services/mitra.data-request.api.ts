// src/features/mitra/data-request/services/mitra.data-request.api.ts

import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { MitraDataRequestIgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import {
  DUMMY_IGT_ITEMS,
  dummyIgtData,
} from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import type GeoJSON from "geojson";

export type MitraDataRequestGetCatalogParams = {
  page?: number;
  perPage?: number;
};

// Aliases for compatibility
export type GetIgtCatalogParams = MitraDataRequestGetCatalogParams;

export async function getIgtCatalog(
  params?: MitraDataRequestGetCatalogParams,
  _signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  console.log("getIgtCatalog params:", params);
  // TODO: Replace with real API client endpoint
  return Promise.resolve(dummyIgtData);
}

export async function getIgtByAoi(
  geometry: GeoJSON.Polygon,
  _signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataItem[]> {
  console.log("getIgtByAoi polygon:", geometry);
  // TODO: Replace with real API client endpoint
  return Promise.resolve(DUMMY_IGT_ITEMS);
}

export async function getIgtByUploadedAoi(
  file: File,
  _signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  console.log("getIgtByUploadedAoi file:", file);
  // TODO: Replace with real API client endpoint
  return Promise.resolve(dummyIgtData);
}

export async function getIgtGeometryById(
  id: string,
): Promise<GeoJSON.FeatureCollection> {
  console.log("getIgtGeometryById id:", id);
  return fetchWfs({
    typeName: WFS_LAYER_NAME,
    cqlFilter: `id='${id}'`,
  });
}
