// src/features/mitra/data-request/api/mitra.data-request.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { MitraDataRequestIgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

export type MitraDataRequestGetCatalogParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function fetchIgtCatalogApi(
  params?: MitraDataRequestGetCatalogParams,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraDataRequestIgtDataResponse>> {
  return apiClient.get<ApiResponse<MitraDataRequestIgtDataResponse>>(
    "/api/mitra/data-request/catalog",
    {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
      },
      signal,
    },
  );
}

export async function fetchIgtByAoiApi(
  geometry: GeoJSON.Polygon,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraDataRequestIgtDataItem[]>> {
  return apiClient.post<ApiResponse<MitraDataRequestIgtDataItem[]>>(
    "/api/mitra/data-request/by-aoi",
    { geometry },
    { signal },
  );
}

export async function fetchIgtByUploadedAoiApi(
  file: File,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraDataRequestIgtDataResponse>> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post<ApiResponse<MitraDataRequestIgtDataResponse>>(
    "/api/mitra/data-request/upload-aoi",
    formData,
    { signal },
  );
}

export async function fetchIgtGeometryByIdApi(
  id: string,
  layerName: string,
  wfsUrl: string,
  signal?: AbortSignal,
): Promise<GeoJSON.FeatureCollection> {
  return fetchWfs({
    typeName: layerName,
    wfsUrl,
    cqlFilter: `id='${id}'`,
    signal,
  });
}
