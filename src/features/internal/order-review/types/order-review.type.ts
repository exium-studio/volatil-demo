// src/features/internal/order-review/types/order-review.type.ts

import type {
  CartOrderItem,
  CartOrderStatus,
  SelectionType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  ApiResponse,
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

import type { ReactNode } from "react";

export type InternalOrderReviewRejectTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

export type InternalOrderReviewRejectModalContentProps = {
  order: InternalOrderItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
};

export type InternalOrderReviewApproveTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

export type InternalOrderReviewApproveModalContentProps = {
  order: InternalOrderItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
  close: () => void;
};

export type InternalOrderReviewDetailTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
};

export type InternalOrderReviewDetailModalContentProps = {
  order: InternalOrderItem;
  close: () => void;
};

export type InternalOrderReviewTteTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccess?: () => void;
};

export type InternalOrderReviewTteModalContentProps = {
  order: InternalOrderItem;
  isOpen: boolean;
  onSuccess?: () => void;
  close: () => void;
};

export type InternalOrderItem = {
  orderId: string;
  orderNumber?: string;
  transactionNumber?: string;
  mitraId: string;
  mitraName: string;
  agencyOrCompany?: string;
  email?: string;
  status: CartOrderStatus;
  selectionType: SelectionType;
  createdAt: string;
  readyAt?: string;
  expiredAt?: string;
  totalPrice: number;
  coverageHa?: number;
  items: CartOrderItem[];
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon | null;
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
  internalWorkspaceUrl?: string | null;
  workspaceInteropUrl?: string | null;
  workspaceName?: string | null;
};

export type InternalOrderListQueryParams = PaginatedParams & {
  status?: CartOrderStatus | "all";
};

export type InternalOrderListResponse = {
  items: InternalOrderItem[];
  pagination: PaginationMeta;
};

export type ProvisionOrderPayload = {
  orderId: string;
};

export type ProvisionOrderResponse = {
  orderId: string;
  transactionStatus: string;
  orderStatus: string;
};

export type ProvisionStreamItemStatus =
  | "pending"
  | "processing"
  | "done"
  | "failed";

export type ProvisionStreamItem = {
  itemId: string;
  itemIndex: number;
  totalItems: number;
  sourceLayerId: string;
  sourceLayerTitle: string;
  igtBasis?: string;
  spatialBasis?: string;
  status: ProvisionStreamItemStatus;
  proxyWmsUrl?: string;
  proxyWfsUrl?: string;
  error?: string;
};

export type ProvisionStreamState = {
  isConnected: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  isFatal: boolean;
  orderStatus: CartOrderStatus | "processing" | "pending_review";
  totalItems: number;
  processedItems: number;
  failedCount: number;
  items: Record<string, ProvisionStreamItem>;
  errorMessage: string | null;
};

export type ProvisionStreamHookResult = ProvisionStreamState & {
  triggerProvision: () => Promise<ApiResponse<ProvisionOrderResponse>>;
  startListening: () => void;
  stopListening: () => void;
  resetState: () => void;
};

import { z } from "zod";

export const approveOrderSchema = z.object({
  workspaceInteropUrl: z
    .string()
    .min(1, "URL Workspace dari INTEROP wajib diisi")
    .url("Format URL tidak valid")
    .refine(
      (val) => /^https?:\/\//i.test(val),
      "URL harus diawali dengan http:// atau https://",
    ),
});

export type ApproveOrderFormValues = z.infer<typeof approveOrderSchema>;

export type ApproveOrderPayload = {
  orderId: string;
  workspaceInteropUrl: string;
};

export type RejectOrderPayload = {
  orderId: string;
  reason: string;
};

export type OrderLayerDataViewProps = {
  order: InternalOrderItem;
};

import type { WmsRasterLayerConfig } from "@/design-system/components/map/types/map.type";

export type OrderReviewLayerState = {
  enabledLayerIds: Record<string, boolean>;
  layerConfigs: Record<string, Partial<WmsRasterLayerConfig>>;
  aoiPolygon: GeoJSON.MultiPolygon | GeoJSON.Polygon | null;
  isAoiVisible: boolean;
  toggleLayer: (
    layerId: string,
    config?: Partial<WmsRasterLayerConfig>,
  ) => void;
  setLayerEnabled: (
    layerId: string,
    enabled: boolean,
    config?: Partial<WmsRasterLayerConfig>,
  ) => void;
  setAoiPolygon: (
    polygon: GeoJSON.MultiPolygon | GeoJSON.Polygon | null,
    visible?: boolean,
  ) => void;
  setAoiVisible: (visible: boolean) => void;
  resetLayers: () => void;
};
