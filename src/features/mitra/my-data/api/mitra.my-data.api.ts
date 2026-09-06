// src/features/mitra/my-data/api/mitra.my-data.api.ts

import type {
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMyDataApi = async (
  params: MyDataQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<MyDataResponse>> => {
  return apiClient.get<ApiResponse<MyDataResponse>>("/api/mitra/my-data", {
    params,
    signal,
  });
};

export const updateMyDataItemApi = async (
  id: string,
  payload: UpdateMyDataItemPayload,
): Promise<ApiResponse<MyDataItem>> => {
  return apiClient.patch<ApiResponse<MyDataItem>>(
    `/api/mitra/my-data/${id}`,
    payload,
  );
};
