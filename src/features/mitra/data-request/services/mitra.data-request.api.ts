// src/features/mitra/data-request/services/mitra.data-request.api.ts

import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import type {
  MitraDataRequestAddAllPayload,
  MitraDataRequestAddSelectedPayload,
  MitraDataRequestAddToCartResponse,
} from "@/features/mitra/data-request/types/mitra.data-request.cart.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { MitraDataRequestIgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import {
  DUMMY_IGT_ITEMS,
  dummyIgtData,
} from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

export type MitraDataRequestGetCatalogParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

export async function getIgtCatalog(
  params?: MitraDataRequestGetCatalogParams,
  signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  console.log("getIgtCatalog params:", params);
  try {
    const response = await apiClient.get<
      ApiResponse<MitraDataRequestIgtDataResponse>
    >("/mitra/data-request/catalog", {
      params: {
        page: params?.page,
        perPage: params?.perPage,
        search: params?.search,
      },
      signal,
    });
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
  console.log("getIgtByAoi polygon:", geometry);
  try {
    const response = await apiClient.post<
      ApiResponse<MitraDataRequestIgtDataItem[]>
    >("/mitra/data-request/by-aoi", { geometry }, { signal });
    return response.data ?? DUMMY_IGT_ITEMS;
  } catch (error) {
    console.warn("getIgtByAoi API error, falling back to dummy data:", error);
    return DUMMY_IGT_ITEMS;
  }
}

export async function getIgtByUploadedAoi(
  file: File,
  signal?: AbortSignal,
): Promise<MitraDataRequestIgtDataResponse> {
  console.log("getIgtByUploadedAoi file:", file);
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<
      ApiResponse<MitraDataRequestIgtDataResponse>
    >("/mitra/data-request/upload-aoi", formData, { signal });
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
): Promise<GeoJSON.FeatureCollection> {
  console.log("getIgtGeometryById id:", id);
  return fetchWfs({
    typeName: WFS_LAYER_NAME,
    cqlFilter: `id='${id}'`,
  });
}

export async function addToCartSelected(
  payload: MitraDataRequestAddSelectedPayload,
  signal?: AbortSignal,
): Promise<MitraDataRequestAddToCartResponse> {
  console.log("addToCartSelected payload:", payload);
  try {
    const response = await apiClient.post<
      ApiResponse<MitraDataRequestAddToCartResponse>
    >("/mitra/cart/add-selected", payload, { signal });
    return (
      response.data ?? {
        success: true,
        addedCount: payload.itemIds.length,
        message: "Berhasil menambahkan item ke keranjang",
      }
    );
  } catch (error) {
    console.warn(
      "addToCartSelected API error, returning fallback response:",
      error,
    );
    return {
      success: true,
      addedCount: payload.itemIds.length,
      message: "Berhasil menambahkan item ke keranjang",
    };
  }
}

export async function addToCartAll(
  payload: MitraDataRequestAddAllPayload,
  signal?: AbortSignal,
): Promise<MitraDataRequestAddToCartResponse> {
  console.log("addToCartAll payload:", payload);
  try {
    const response = await apiClient.post<
      ApiResponse<MitraDataRequestAddToCartResponse>
    >("/mitra/cart/add-all", payload, { signal });
    return (
      response.data ?? {
        success: true,
        addedCount: 10,
        message: "Berhasil menambahkan semua item ke keranjang",
      }
    );
  } catch (error) {
    console.warn(
      "addToCartAll API error, returning fallback response:",
      error,
    );
    return {
      success: true,
      addedCount: 10,
      message: "Berhasil menambahkan semua item ke keranjang",
    };
  }
}
