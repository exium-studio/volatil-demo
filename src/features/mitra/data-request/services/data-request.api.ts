// src/features/mitra/data-request/services/data-request.api.ts

import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type { IgtDataResponse } from "@/features/mitra/data-request/types/data-request.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/igt-by-aoi.type";
import {
  DUMMY_IGT_ITEMS,
  dummyIgtData,
} from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import type GeoJSON from "geojson";
// import { apiClient } from "@/shared/libs/api-client/api-client";

export type GetIgtCatalogParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

/** Pure API Services for Data Request feature */
export const getIgtCatalog = async (
  _params?: GetIgtCatalogParams,
  _signal?: AbortSignal,
): Promise<IgtDataResponse> => {
  // TODO: replace with real backend API endpoint:
  // return apiClient.get<IgtDataResponse>("/v1/igt/catalog", { params: _params, signal: _signal });
  return dummyIgtData;
};

export const getIgtByAoi = async (
  _geometry: GeoJSON.Polygon,
  _signal?: AbortSignal,
): Promise<IgtDataItem[]> => {
  // TODO: replace with real backend API endpoint:
  // return apiClient.post<IgtDataItem[]>("/v1/igt/clip-aoi", { geometry: _geometry }, { signal: _signal });
  return DUMMY_IGT_ITEMS;
};

export const getIgtByUploadedAoi = async (
  _file: File,
  _signal?: AbortSignal,
): Promise<IgtDataResponse> => {
  // TODO: replace with real backend API endpoint:
  // const formData = new FormData();
  // formData.append("file", _file);
  // return apiClient.post<IgtDataResponse>("/v1/igt/upload-aoi", formData, { signal: _signal });
  return dummyIgtData;
};

export const getIgtGeometryById = async (
  id: string,
  signal?: AbortSignal,
): Promise<GeoJSON.FeatureCollection> => {
  return fetchWfs({
    typeName: WFS_LAYER_NAME,
    cqlFilter: `id='${id}'`,
    signal,
  });
};
