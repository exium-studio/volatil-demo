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
import { z } from "zod";

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

export type UpdatePeriodItem = {
  unit: string;
  jobId?: string | null;
  offset: number;
  targetAt: string;
  completed: boolean;
  milestone: number;
  executedAt?: string | null;
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
  totalAmount?: number;
  transactionStatus?: string;
  paidAt?: string;
  expiresAt?: string;
  coverageHa?: number;
  kawasanCoverageHa?: number | null;
  featuresCount?: number | null;
  bidangCoverageCount?: number | null;
  items: CartOrderItem[];
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon | null;
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
  internalWorkspaceUrl?: string | null;
  workspaceInteropUrl?: string | null;
  workspaceName?: string | null;
  updatePeriods?: UpdatePeriodItem[];
  billingCode?: string | null;
  billingExpiredAt?: string | null;
  billingIssuedAt?: string | null;
  paymentSubmittedAt?: string | null;
  paymentNotes?: string | null;
  ntpn?: string | null;
  paymentProofUrl?: string | null;
  paymentProofName?: string | null;
  isManualPayment?: boolean;
  paymentVerificationStatus?: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
};

export type InputBillingCodePayload = {
  orderId: string;
  billingCode: string;
  billingExpiredAt?: string;
};

export type InternalOrderReviewInputBillingTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccess?: () => void;
};

export const inputBillingCodeSchema = z.object({
  billingCode: z
    .string()
    .min(1, "Kode billing wajib diisi")
    .regex(/^\d{15}$/, "Kode billing SIMPONI harus terdiri dari tepat 15 digit angka"),
  billingExpiredAt: z.string().min(1, "Batas waktu pembayaran wajib diisi"),
});

export type InputBillingCodeFormValues = z.infer<typeof inputBillingCodeSchema>;

export type InternalOrderReviewInputBillingModalContentProps = {
  order: InternalOrderItem;
  close: () => void;
  onSuccess?: () => void;
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

export type OrderSummaryProps = {
  order: InternalOrderItem;
  isAoiVisible: boolean;
  hasAoi: boolean;
  onToggleAoi: (checked: boolean) => void;
  onFlyToAoi: () => void;
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
