// src/features/internal/pricing/api/internal.pricing.api.ts

import type {
  CreatePricingPayload,
  PricingListResponse,
  PricingQueryParams,
  UpdatePricingPayload,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchInternalPricingListApi = async (
  params?: PricingQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PricingListResponse>> => {
  return apiClient.get<ApiResponse<PricingListResponse>>(
    "/api/internal/pricing",
    {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        spatialBasis: params?.spatialBasis,
      },
      signal,
    },
  );
};

export const updateInternalPricingApi = async (
  payload: UpdatePricingPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/pricing/${payload.id}`,
    payload,
    { signal },
  );
};

export const createInternalPricingApi = async (
  payload: CreatePricingPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.post<ApiResponse<void>>("/api/internal/pricing", payload, {
    signal,
  });
};
