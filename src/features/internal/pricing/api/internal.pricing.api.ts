// src/features/internal/pricing/api/internal.pricing.api.ts

import type {
  CreatePricingPayload,
  PricingListResponse,
  PricingQueryParams,
  UpdatePricingPayload,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { DUMMY_PRICING_RESPONSE } from "@/shared/constants/dummy-data/dummy-pricing";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const fetchInternalPricingListApi = async (
  params?: PricingQueryParams,
  signal?: AbortSignal,
): Promise<PricingListResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<PricingListResponse>>(
      "/api/internal/pricing",
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          search: params?.search,
          spatialBasis: params?.spatialBasis,
          isActive: params?.isActive,
        },
        signal,
      },
    );

    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled() ? DUMMY_PRICING_RESPONSE : { items: [], pagination: DUMMY_PRICING_RESPONSE.pagination };
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("fetchInternalPricingListApi fallback to dummy data:", error);
      return DUMMY_PRICING_RESPONSE;
    }
    throw error;
  }
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
  return apiClient.post<ApiResponse<void>>(
    "/api/internal/pricing",
    payload,
    { signal },
  );
};
