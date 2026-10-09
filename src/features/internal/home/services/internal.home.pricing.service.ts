// src/features/internal/home/services/internal.home.pricing.service.ts

import { fetchInternalHomePricingApi } from "@/features/internal/home/api/internal.home.pricing.api";
import type { InternalHomePricingItem } from "@/features/internal/home/types/internal.home.pricing.type";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const DUMMY_PRICINGS: InternalHomePricingItem[] = [
  {
    id: "pricing-bidang",
    price: 7500,
    pnbpCode: "425121",
    minimumPurchase: 1000,
    igtBasis: "bidang",
    unit: "bidang",
  },
  {
    id: "pricing-kawasan",
    price: 20000,
    pnbpCode: "425121",
    minimumPurchase: 1000,
    igtBasis: "kawasan",
    unit: "kawasan",
  },
];

export const getInternalHomePricings = async (
  signal?: AbortSignal,
): Promise<InternalHomePricingItem[]> => {
  try {
    const raw = await fetchInternalHomePricingApi(signal);

    // Case 1: Backend returns { success: true, data: [...] }
    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return raw.data;
    }

    // Case 2: Backend returns flat array [...]
    if (Array.isArray(raw)) {
      return raw;
    }

    // Case 3: Backend returns paginated { data: { items: [...] } }
    if (
      raw &&
      "data" in raw &&
      raw.data &&
      typeof raw.data === "object" &&
      "items" in raw.data &&
      Array.isArray((raw.data as unknown as { items: unknown[] }).items)
    ) {
      return (raw.data as unknown as { items: InternalHomePricingItem[] }).items;
    }

    return isDummyDataEnabled() ? DUMMY_PRICINGS : [];
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() &&
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      return DUMMY_PRICINGS;
    }
    return isDummyDataEnabled() ? DUMMY_PRICINGS : [];
  }
};
