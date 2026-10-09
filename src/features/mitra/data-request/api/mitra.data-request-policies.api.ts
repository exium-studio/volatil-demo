// src/features/mitra/data-request/api/mitra.data-request-policies.api.ts

import type { MitraPricingPolicyResponse } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const DUMMY_POLICIES_RESPONSE: MitraPricingPolicyResponse = {
  pricing: {
    globalLimits: {
      minimumBidangCount: 1000,
      minimumKawasanHa: 1000,
      pricePerBidang: 7500,
      pricePerKawasanHa: 20000,
    },
    pnbpCode: "425121",
    paymentTimeoutFallbackHours: 24,
    items: [
      {
        id: "default-bidang",
        layerId: null,
        layerTitle: null,
        kodePnbp: "425121",
        spatialBasis: "bidang",
        unitPrice: 7500,
        unitLabel: "per bidang",
        minPurchase: 1000,
        minUnit: "Bidang",
        description: "Tarif dasar PNBP per bidang objek spasial",
      },
      {
        id: "default-kawasan",
        layerId: null,
        layerTitle: null,
        kodePnbp: "425121",
        spatialBasis: "kawasan",
        unitPrice: 20000,
        unitLabel: "per hektar",
        minPurchase: 1000,
        minUnit: "Ha",
        description: "Tarif dasar PNBP per hektar area kawasan",
      },
    ],
  },
  order: {
    accessDurationDays: 365,
    maxExtensionCount: 1,
    extensionWindowDays: 7,
  },
};

export const getMitraDataRequestPolicies = async (
  category?: "pricing" | "order",
  signal?: AbortSignal,
): Promise<MitraPricingPolicyResponse> => {
  try {
    const raw = await apiClient.get<
      ApiResponse<MitraPricingPolicyResponse> | MitraPricingPolicyResponse
    >("/api/mitra/data-request/policies", {
      params: category ? { category } : undefined,
      signal,
    });

    if (raw && "data" in raw && raw.data) {
      return raw.data;
    }

    if (raw && ("pricing" in raw || "order" in raw)) {
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

    throw error;
  }
};
