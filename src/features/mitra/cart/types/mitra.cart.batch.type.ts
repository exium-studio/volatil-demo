// src/features/mitra/cart/types/mitra.cart.batch.type.ts

import type GeoJSON from "geojson";

export type SpatialBasisType = "bidang" | "kawasan";

export type SelectionType = "catalog" | "upload_aoi" | "draw_aoi";

export type SelectionTypeConfig = {
  label: string;
  variant: "subtle" | "outline" | "solid";
  colorPalette?: "blue" | "teal" | "purple" | "orange" | "gray";
};

export type SpatialBasisTypeConfig = {
  label: string;
  colorPalette: "blue" | "orange";
};

export type BatchStatus =
  | "preparing"
  | "pending_review"
  | "approved"
  | "rejected"
  | "expired";

export type CartBatchStatus = BatchStatus | "ready";

export type CartBatchStatusConfig = {
  label: string;
  colorPalette: "green" | "blue" | "red" | "gray" | "orange";
  icon: (typeof import("lucide-react"))["CheckCircle2Icon"];
  iconColor: string;
};

export type MitraCartBatchItemProps = {
  batch: CartBatch;
  index: number;
  isSelected: boolean;
  onSelect: (batchId: string) => void;
  onDelete?: (batchId: string) => void;
  isDeleting?: boolean;
};

export type MitraCartOrderListProps = {
  selectedBatchId: string | null;
  onSelectBatch: (batchId: string) => void;
};

export type MitraCartOrderDetailProps = {
  selectedBatchId: string | null;
  selectedBatchIndex: number;
};

export type PaymentMethod =
  | "MPN_GEN2"
  | "VA_MANDIRI"
  | "VA_BRI"
  | "VA_BCA"
  | "QRIS";

export type CartBatchItemPayload = {
  sourceLayerId: string;
  cqlFilter?: string;
  wfsUrl?: string;
  wmsUrl?: string;
};

export type AddToCartBatchRequest = {
  selectionType: SelectionType;
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  items: CartBatchItemPayload[];
};

export type AddToCartBatchResponse = {
  batchId: string;
  status: CartBatchStatus;
  estimatedTotalPrice: number;
  createdAt: string;
};

export type CartBatchReorderResponse = AddToCartBatchResponse;

export type CartBatchItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  featuresCount: number;
  areaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  wfsUrl?: string;
  wmsUrl?: string;
};

export type CartBatch = {
  batchId: string;
  status: CartBatchStatus;
  selectionType: SelectionType;
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  createdAt: string;
  readyAt?: string;
  approvedAt?: string;
  expiredAt?: string;
  rejectionReason?: string;
  totalPrice: number;
  items: CartBatchItem[];
};

export type ActiveCartBatch = CartBatch;
export type ActiveCartBatchItem = CartBatchItem;

export type CartBatchListResponse = {
  batches: CartBatch[];
  total: number;
};

export type CheckoutBatchRequest = {
  paymentMethod?: PaymentMethod;
};

export type CheckoutBatchResponse = {
  orderId: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  paymentMethod?: string;
  totalAmount: number;
  status: "pending";
  createdAt: string;
  billingExpiredAt: string;
};
