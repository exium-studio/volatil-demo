// src/features/internal/home/services/internal.home.pricing.service.ts

import { fetchInternalHomePricingApi } from "@/features/internal/home/api/internal.home.pricing.api";
import type { InternalHomePricingItem } from "@/features/internal/home/types/internal.home.pricing.type";

export const getInternalHomePricings = async (
  signal?: AbortSignal,
): Promise<InternalHomePricingItem[]> => {
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

  return [];
};
