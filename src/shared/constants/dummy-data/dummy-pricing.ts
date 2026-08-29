// src/shared/constants/dummy-data/dummy-pricing.ts

import type { PricingItem, PricingListResponse } from "@/features/internal/pricing/types/internal.pricing.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_PRICING_ITEMS: PricingItem[] = [
  {
    id: "price-bidang-default",
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
    id: "price-kawasan-default",
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
  {
    id: "price-badung-rtrw",
    layerId: "testing_workspace:TEST_RTRW_BADUNG",
    layerTitle: "RTRW Badung",
    spatialBasis: "kawasan",
    unitPrice: 175000,
    unitLabel: "per hektar",
    effectiveDate: "2025-02-01T00:00:00Z",
    description:
      "Tarif khusus kawasan rencana tata ruang wilayah Kabupaten Badung",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "price-badung-znt",
    layerId: "testing_workspace:TEST_ZNT_BADUNG",
    layerTitle: "ZNT Badung",
    spatialBasis: "kawasan",
    unitPrice: 200000,
    unitLabel: "per hektar",
    effectiveDate: "2025-02-01T00:00:00Z",
    description: "Tarif zona nilai tanah wilayah Kabupaten Badung",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "price-bidang-tanah",
    layerId: "testing_workspace:TEST_BIDANG_TANAH",
    layerTitle: "Bidang Tanah",
    spatialBasis: "bidang",
    unitPrice: 50000,
    unitLabel: "per bidang",
    effectiveDate: "2025-01-15T00:00:00Z",
    description: "Tarif layer kadastral bidang tanah persil",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
];

export const DUMMY_PRICING_RESPONSE: PricingListResponse = {
  items: DUMMY_PRICING_ITEMS,
  pagination: createPaginationMeta(1, 10, DUMMY_PRICING_ITEMS.length),
};
