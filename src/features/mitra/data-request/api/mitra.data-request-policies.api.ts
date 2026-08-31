// src/features/mitra/data-request/api/mitra.data-request-policies.api.ts

import type { MitraPricingPolicyResponse } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import { DUMMY_PRICING_ITEMS } from "@/shared/constants/dummy-data/dummy-pricing";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const DUMMY_POLICIES_RESPONSE: MitraPricingPolicyResponse = {
  policies: DUMMY_PRICING_ITEMS.map((item) => ({
    id: item.id,
    spatialBasis: item.spatialBasis,
    unitPrice: item.unitPrice,
    unitLabel: item.unitLabel,
    minPurchase:
      item.spatialBasis === "bidang"
        ? CART_CONFIG.minimumBidangCount
        : CART_CONFIG.minimumKawasanHa,
    minUnit: item.spatialBasis === "bidang" ? "bidang" : "ha",
    description: item.description,
  })),
  config: {
    minimumBidangCount: CART_CONFIG.minimumBidangCount,
    minimumKawasanHa: CART_CONFIG.minimumKawasanHa,
    pricePerBidang: CART_CONFIG.pricePerBidang,
    pricePerKawasanHa: CART_CONFIG.pricePerKawasanHa,
  },
};

export const getMitraDataRequestPolicies = async (
  signal?: AbortSignal,
): Promise<MitraPricingPolicyResponse> => {
  try {
    const raw = await apiClient.get<
      ApiResponse<MitraPricingPolicyResponse> | MitraPricingPolicyResponse
    >("/api/mitra/data-request/policies", {
      signal,
    });

    if (raw && "data" in raw && raw.data) {
      return raw.data;
    }

    if (raw && "config" in raw) {
      return raw as MitraPricingPolicyResponse;
    }

    return isDummyDataEnabled()
      ? DUMMY_POLICIES_RESPONSE
      : DUMMY_POLICIES_RESPONSE;
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }

    if (isDummyDataEnabled()) {
      return DUMMY_POLICIES_RESPONSE;
    }

    return DUMMY_POLICIES_RESPONSE;
  }
};
