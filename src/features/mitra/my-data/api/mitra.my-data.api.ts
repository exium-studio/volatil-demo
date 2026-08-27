// src/features/mitra/my-data/api/mitra.my-data.api.ts

import type {
  MyDataQueryParams,
  MyDataResponse,
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
