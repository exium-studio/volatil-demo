// src/features/mitra/cart/types/mitra.cart.batch.type.ts

import type GeoJSON from "geojson";

export type SpatialBasisType = "bidang" | "kawasan";

export type SelectionType =
  | "administrative_filter"
  | "aoi_polygon"
  | "selected_features"
  | "whole_layer";

export type CartBatchStatus = "preparing" | "ready" | "expired";

export type PaymentMethod =
  | "MPN_GEN2"
  | "VA_MANDIRI"
  | "VA_BRI"
  | "VA_BCA"
  | "QRIS";

export type CartBatchItemPayload = {
  sourceLayerId: string;
  selectionType: SelectionType;
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  selectedFeatureIds?: string[];
};

export type AddToCartBatchRequest = {
  items: CartBatchItemPayload[];
};

export type AddToCartBatchResponse = {
  batchId: string;
  status: "preparing";
  estimatedTotalPrice: number;
  createdAt: string;
};

export type ActiveCartBatchItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  selectionType: SelectionType;
  featuresCount: number;
  areaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  wfsUrl?: string;
  wmsUrl?: string;
};

export type ActiveCartBatch = {
  batchId: string;
  status: CartBatchStatus;
  createdAt: string;
  readyAt?: string;
  expiredAt?: string;
  totalPrice: number;
  items: ActiveCartBatchItem[];
};

export type CheckoutBatchRequest = {
  paymentMethod: PaymentMethod;
};

export type CheckoutBatchResponse = {
  orderId: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  paymentMethod: string;
  totalAmount: number;
  status: "pending";
  createdAt: string;
  billingExpiredAt: string;
};
