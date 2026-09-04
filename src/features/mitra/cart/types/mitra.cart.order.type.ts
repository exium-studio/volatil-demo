// src/features/mitra/cart/types/mitra.cart.order.type.ts

import type GeoJSON from "geojson";
import type {
  OrderStatus,
  OrderStatusConfig,
  TransactionStatus,
} from "@/shared/types/status.type";

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

export type CartOrderStatus = OrderStatus;
export type CartOrderStatusConfig = OrderStatusConfig;

export type MitraCartOrderItemProps = {
  order: CartOrder;
  index: number;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onDelete?: (orderId: string) => void;
  isDeleting?: boolean;
};

export type MitraCartOrderListProps = {
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
};

export type MitraCartOrderDetailProps = {
  selectedOrderId: string | null;
  selectedOrderIndex: number;
};

export type PaymentMethod =
  | "MPN_GEN2"
  | "VA_MANDIRI"
  | "VA_BRI"
  | "VA_BCA"
  | "QRIS";

export type CartOrderItemPayload = {
  sourceLayerId: string;
  cqlFilter?: string;
  wfsUrl?: string;
  wmsUrl?: string;
};

export type AddToCartOrderRequest = {
  selectionType: SelectionType;
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  items: CartOrderItemPayload[];
};

export type AddToCartOrderResponse = {
  orderId: string;
  status: CartOrderStatus;
  estimatedTotalPrice: number;
  createdAt: string;
};

export type CartOrderReorderResponse = AddToCartOrderResponse;

export type CartOrderItem = {
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
  previewWmsUrl?: string;
  previewWfsUrl?: string;
  externalWfsUrl?: string | null;
  externalWmsUrl?: string | null;
};

export type CartOrder = {
  orderId: string;
  status: CartOrderStatus;
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
  items: CartOrderItem[];
};

export type ActiveCartOrder = CartOrder;
export type ActiveCartOrderItem = CartOrderItem;

export type CartOrderListResponse = {
  orders: CartOrder[];
  total: number;
};

export type CheckoutOrderRequest = {
  paymentMethod?: PaymentMethod;
};

export type CheckoutOrderResponse = {
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

export type CheckPaymentStatusResponse = {
  orderId: string;
  transactionStatus: TransactionStatus;
  paidAt?: string;
  billingCode?: string;
};

export type OrderPaymentStatusResponse = CheckPaymentStatusResponse;
