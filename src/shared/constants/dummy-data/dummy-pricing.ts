// src/shared/constants/dummy-data/dummy-pricing.ts

import type {
  PricingItem,
  PricingListResponse,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_PRICING_ITEMS: PricingItem[] = [
  {
    id: "default-bidang",
    layerTitle: "Tarif Standar Bidang Tanah (Global)",
    spatialBasis: "bidang",
    unitPrice: 50000,
    unitLabel: "per bidang",
    effectiveDate: "2025-01-01T00:00:00Z",
    description: "Tarif dasar PNBP ATR/BPN per objek bidang tanah terdaftar",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "default-kawasan",
    layerTitle: "Tarif Standar Kawasan / RTRW (Global)",
    spatialBasis: "kawasan",
    unitPrice: 150000,
    unitLabel: "per hektar",
    effectiveDate: "2025-01-01T00:00:00Z",
    description:
      "Tarif dasar PNBP per hektar area kawasan peruntukan dan pola ruang",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

export const DUMMY_PRICING_RESPONSE: PricingListResponse = {
  items: DUMMY_PRICING_ITEMS,
  pagination: createPaginationMeta(1, 10, DUMMY_PRICING_ITEMS.length),
};
