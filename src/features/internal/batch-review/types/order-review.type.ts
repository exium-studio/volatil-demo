// src/features/internal/batch-review/types/order-review.type.ts

import type {
  CartOrderItem,
  CartOrderStatus,
  SelectionType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type InternalOrderReviewRejectModalContentProps = {
  order: InternalOrderItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
};

export type InternalOrderItem = {
  orderId: string;
  batchId?: string; // backwards compatibility alias
  mitraId: string;
  mitraName: string;
  status: CartOrderStatus;
  selectionType: SelectionType;
  createdAt: string;
  readyAt?: string;
  expiredAt?: string;
  totalPrice: number;
  items: CartOrderItem[];
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

export type ApproveOrderItemPayload = {
  id: string;
  externalWmsUrl: string;
  externalWfsUrl?: string;
};

export type ApproveOrderPayload = {
  orderId: string;
  items?: ApproveOrderItemPayload[];
};

export type RejectOrderPayload = {
  orderId: string;
  reason: string;
};

export type OrderLayerDataViewProps = {
  order: InternalOrderItem;
  onDetailAttribute: (item: CartOrderItem) => void;
};

// Backwards-compatible aliases
export type InternalBatchReviewRejectModalContentProps = InternalOrderReviewRejectModalContentProps;
export type InternalBatchItem = InternalOrderItem;
export type InternalBatchListQueryParams = InternalOrderListQueryParams;
export type InternalBatchListResponse = InternalOrderListResponse;
export type ApproveBatchItemPayload = ApproveOrderItemPayload;
export type ApproveBatchPayload = ApproveOrderPayload;
export type RejectBatchPayload = RejectOrderPayload;
export type BatchLayerDataViewProps = OrderLayerDataViewProps;
