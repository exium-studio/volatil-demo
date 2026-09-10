// src/features/mitra/cart/types/mitra.cart.order.type.ts

import type GeoJSON from "geojson";
import type {
  OrderStatus,
  OrderStatusConfig,
  TransactionStatus,
} from "@/shared/types/status.type";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

export type IgtBasisType = "bidang" | "kawasan";
/** @deprecated alias for IgtBasisType */
export type SpatialBasisType = IgtBasisType;

export type SelectionType = "catalog" | "upload_aoi" | "draw_aoi";

export type SelectionTypeConfig = {
  label: string;
  variant: "subtle" | "outline" | "solid";
  colorPalette?: "blue" | "teal" | "purple" | "orange" | "gray";
  icon?: LucideIcon | TablerIcon;
};

export type IgtBasisTypeConfig = {
  label: string;
  colorPalette: "blue" | "orange";
  icon: LucideIcon;
};
/** @deprecated alias for IgtBasisTypeConfig */
export type SpatialBasisTypeConfig = IgtBasisTypeConfig;

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

export type CartItemsQueryParams = {
  page: number;
  pageSize: number;
  typeName: string;
  wfsUrl: string;
  search?: string;
  cqlFilter?: string;
};

export type MitraCartExpiredOrdersTriggerProps = {
  modalKey?: string;
  children: import("react").ReactNode;
};

export type MitraCartExpiredOrdersModalContentProps = {
  modalKey: string;
  close: () => void;
  expiredOrders: CartOrder[];
  isLoading: boolean;
};

export type MitraCartBatchItemProps = {
  batch?: CartOrder;
  order?: CartOrder;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export type MitraCartOrderSummaryProps = {
  activeOrder: ActiveCartOrder | null;
  orderIndex?: number | null;
  isLoading?: boolean;
};

export type CartOrderItemPayload = {
  sourceLayerId: string;
  cqlFilter?: string;
  wfsUrl?: string;
  wmsUrl?: string;
};

export type AddToCartOrderRequest = {
  selectionType: SelectionType;
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  items: CartOrderItemPayload[];
  /** @deprecated Kept for backward compatibility */
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  /** @deprecated Kept for backward compatibility */
  cqlFilter?: string;
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
  /** Bounding box layer IGT: [minLon, minLat, maxLon, maxLat] (EPSG:4326) */
  bbox?: [number, number, number, number];
};

export type CartOrder = {
  orderId: string;
  status: CartOrderStatus;
  selectionType: SelectionType;
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coverageHa?: number;
  featuresCount?: number;
  createdAt: string;
  readyAt?: string;
  approvedAt?: string;
  expiredAt?: string;
  rejectionReason?: string;
  totalPrice: number;
  items: CartOrderItem[];
  /** @deprecated Kept for backward compatibility */
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  /** @deprecated Kept for backward compatibility */
  cqlFilter?: string;
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
