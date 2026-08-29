// src/features/internal/pricing/services/internal.pricing.service.ts

import {
  createInternalPricingApi,
  fetchInternalPricingListApi,
  updateInternalPricingApi,
} from "@/features/internal/pricing/api/internal.pricing.api";
import type {
  CreatePricingPayload,
  PricingListResponse,
  PricingQueryParams,
  UpdatePricingPayload,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { DUMMY_PRICING_RESPONSE } from "@/shared/constants/dummy-data/dummy-pricing";
import { ApiError } from "@/shared/libs/api-client/api-error";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_PRICING_RESPONSE: PricingListResponse = {
  items: [],
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const getPricingList = async (
  params?: PricingQueryParams,
  signal?: AbortSignal,
): Promise<PricingListResponse> => {
  try {
    const raw = await fetchInternalPricingListApi(params, signal);

    // Case 1: Backend returns { success: true, data: { items: [...] } }
    if (raw && "data" in raw && raw.data && "items" in raw.data && Array.isArray(raw.data.items)) {
      return raw.data;
    }

    // Case 2: Backend returns { success: true, data: [...] } (array directly inside data)
    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return {
        items: raw.data,
        pagination: {
          totalItems: raw.data.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: raw.data.length || 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Case 3: Backend returns flat { items: [...] }
    if (raw && "items" in raw && Array.isArray(raw.items)) {
      return raw as unknown as PricingListResponse;
    }

    // Case 4: Backend returns raw array [...]
    if (Array.isArray(raw)) {
      return {
        items: raw,
        pagination: {
          totalItems: raw.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: raw.length || 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    console.warn("getPricingList: unhandled response format", raw);
    return isDummyDataEnabled() ? DUMMY_PRICING_RESPONSE : EMPTY_PRICING_RESPONSE;
  } catch (error) {
    // Do NOT fallback on AbortError — request was intentionally cancelled
    if ((error as { name?: string }).name === "AbortError") {
      throw error;
    }

    // Only fallback to dummy on 404 when dummy mode is enabled
    if (
      isDummyDataEnabled() &&
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      console.warn("getPricingList: 404 fallback to dummy data", error);
      return DUMMY_PRICING_RESPONSE;
    }

    throw error;
  }
};

export const updatePricing = async (
  payload: UpdatePricingPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return updateInternalPricingApi(payload, signal);
};

export const createPricing = async (
  payload: CreatePricingPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return createInternalPricingApi(payload, signal);
};
