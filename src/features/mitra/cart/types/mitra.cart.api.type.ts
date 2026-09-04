// src/features/mitra/cart/types/mitra.cart.api.type.ts

import type GeoJSON from "geojson";

export type IgtBasisType = "bidang" | "kawasan";
/** @deprecated alias for IgtBasisType */
export type SpatialBasisType = IgtBasisType;

export type SelectionType = "catalog" | "upload_aoi" | "draw_aoi";

import type { OrderStatus } from "@/shared/types/status.type";

export type { OrderStatus };

// ==========================================
// 1. ADD TO CART & SELECTION PAYLOAD
// ==========================================

export type AddToCartItemPayload = {
  sourceLayerId: string;
  selectionType: SelectionType;
  /** MultiPolygon / Polygon coordinate geometry in EPSG:4326 lon/lat order */
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
};

export type AddToCartRequest = {
  items: AddToCartItemPayload[];
};

// ==========================================
// 2. CART ITEM & SUMMARY
// ==========================================

export type CartItemDto = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  selectionType: SelectionType;
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  estimatedFeaturesCount: number;
  estimatedAreaHa?: number;
  unitPrice: number;
  estimatedSubtotalPrice: number;
  createdAt: string;
};

export type CartResponse = {
  items: CartItemDto[];
  summary: {
    totalItems: number;
    totalBidang: number;
    totalBidangPrice: number;
    totalKawasan: number;
    totalKawasanHa: number;
    totalKawasanPrice: number;
    grandTotal: number;
  };
};

// ==========================================
// 3. CHECKOUT & ORDER RESPONSE
// ==========================================

export type CreateOrderCheckoutRequest = {
  cartItemIds?: string[];
  notes?: string;
};

export type CreateOrderCheckoutResponse = {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  billingCode: string;
  totalPrice: number;
  validatedAt: string;
  expiredAt: string;
};

// ==========================================
// 4. PROVISIONED LAYER & ORDER DETAIL DTO
// ==========================================

export type ProvisionedLayerDto = {
  id: string;
  orderItemId: string;
  tableName: string;
  geoserverWorkspace: string;
  geoserverLayerName: string;
  /** Proxy endpoint URL for secure FE/BE access without exposing GeoServer directly */
  proxyWfsUrl: string;
  proxyWmsUrl: string;
  /** Masked key display for UI list/details (null if key has not been generated yet) */
  apiKeyMasked: string | null;
  /** Timestamp when the active key was generated (null if uninitialized) */
  keyGeneratedAt: string | null;
  /**
   * One-time reveal raw key.
   * Strictly undefined in standard list/detail endpoints.
   */
  rawApiKey?: string;
  status: OrderStatus;
  retryCount: number;
  errorMessage?: string;
  lastAttemptedAt?: string;
  provisionedAt?: string;
  validUntil: string;
  deprovisionedAt?: string;
};

export type OrderItemDetailDto = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  selectionType: SelectionType;
  snapshotFeaturesCount: number;
  snapshotAreaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  provisionedLayer?: ProvisionedLayerDto;
};

export type OrderDetailResponse = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  billingCode?: string;
  totalPrice: number;
  orderedAt: string;
  validatedAt: string;
  expiredAt?: string;
  items: OrderItemDetailDto[];
};

// ==========================================
// 5. KEY GENERATION & ROTATION SPECIFICATION
// ==========================================

export type GenerateApiKeyRequest = {
  provisionedLayerId: string;
};

export type GenerateApiKeyResponse = {
  provisionedLayerId: string;
  apiKeyMasked: string;
  /** One-time reveal: Plaintext key returned strictly once upon generation/rotation */
  rawApiKey: string;
  keyGeneratedAt: string;
};
