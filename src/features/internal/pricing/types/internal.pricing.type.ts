// src/features/internal/pricing/types/internal.pricing.type.ts

import type { PaginatedParams, PaginationMeta } from "@/shared/types/common-response.type";

export type SpatialBasisType = "bidang" | "kawasan";

export type PricingTierType = "standard" | "premium" | "enterprise";

export type PricingItem = {
  id: string;
  layerId?: string;
  layerTitle?: string;
  spatialBasis: SpatialBasisType;
  unitPrice: number;
  unitLabel: string;
  effectiveDate: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PricingQueryParams = PaginatedParams & {
  spatialBasis?: SpatialBasisType;
  isActive?: boolean;
};

export type PricingListResponse = {
  items: PricingItem[];
  pagination: PaginationMeta;
};

export type UpdatePricingPayload = {
  id: string;
  unitPrice: number;
  isActive?: boolean;
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
  isActive: boolean;
};
