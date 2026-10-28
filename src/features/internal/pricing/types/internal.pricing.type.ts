// src/features/internal/pricing/types/internal.pricing.type.ts

import type { PaginatedParams, PaginationMeta } from "@/shared/types/common-response.type";

export type IgtBasisType = "bidang" | "kawasan";

export type PricingTierType = "standard" | "premium" | "enterprise";

export type PricingItem = {
  id: string;
  price: number;
  pnbpCode: string;
  minimumPurchase: number;
  igtBasis: IgtBasisType;
  unit: "bidang" | "ha" | string;
  layerId?: string;
  layerTitle?: string;
  kodePnbp?: string;
  spatialBasis?: IgtBasisType;
  unitPrice?: number;
  unitLabel?: string;
  minPurchase?: number;
  minUnit?: string;
  effectiveDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PricingQueryParams = PaginatedParams & {
  igtBasis?: IgtBasisType;
  spatialBasis?: IgtBasisType;
};

export type PricingListResponse = {
  items: PricingItem[];
  pagination: PaginationMeta;
};

export type UpdatePricingPayload = {
  id: string;
  price?: number;
  pnbpCode?: string;
  minimumPurchase?: number;
};

export type CreatePricingPayload = {
  layerId?: string;
  layerTitle?: string;
  igtBasis: IgtBasisType;
  spatialBasis?: IgtBasisType;
  unitPrice: number;
  unitLabel: string;
  effectiveDate: string;
  description?: string;
};

export type InternalPricingEditModalProps = {
  modalKey?: string;
  item: PricingItem | null;
  onClose: () => void;
};

export type InternalPricingEditModalContentProps = {
  modalKey: string;
  item: PricingItem;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};


