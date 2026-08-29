// src/features/internal/pricing/types/internal.pricing.type.ts

import type { PaginatedParams, PaginationMeta } from "@/shared/types/common-response.type";

export type SpatialBasisType = "bidang" | "kawasan";

export type PricingTierType = "standard" | "premium" | "enterprise";

export type PricingItem = {
  id: string;
  layerId?: string;
  layerTitle?: string;
  kodePnbp?: string;
  spatialBasis: SpatialBasisType;
  unitPrice: number;
  unitLabel: string;
  minPurchase?: number;
  minUnit?: string;
  effectiveDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type PricingQueryParams = PaginatedParams & {
  spatialBasis?: SpatialBasisType;
};

export type PricingListResponse = {
  items: PricingItem[];
  pagination: PaginationMeta;
};

export type UpdatePricingPayload = {
  id: string;
  unitPrice: number;
  kodePnbp?: string;
  minPurchase?: number;
  description?: string;
};

export type CreatePricingPayload = {
  layerId?: string;
  layerTitle?: string;
  spatialBasis: SpatialBasisType;
  unitPrice: number;
  unitLabel: string;
  effectiveDate: string;
  description?: string;
};
