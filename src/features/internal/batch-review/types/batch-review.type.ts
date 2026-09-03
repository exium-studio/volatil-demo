// src/features/internal/batch-review/types/batch-review.type.ts

import type {
  CartBatchItem,
  CartBatchStatus,
  SelectionType,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type InternalBatchReviewRejectModalContentProps = {
  batch: InternalBatchItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
};

export type InternalBatchItem = {
  batchId: string;
  orderId?: string;
  mitraId: string;
  mitraName: string;
  status: CartBatchStatus;
  selectionType: SelectionType;
  createdAt: string;
  readyAt?: string;
  expiredAt?: string;
  totalPrice: number;
  items: CartBatchItem[];
};

export type InternalBatchListQueryParams = PaginatedParams & {
  status?: CartBatchStatus | "all";
};

export type InternalBatchListResponse = {
  items: InternalBatchItem[];
  pagination: PaginationMeta;
};

export type ProvisionOrderPayload = {
  orderId: string;
  batchId?: string;
};

export type ProvisionOrderResponse = {
  orderId: string;
  batchId?: string;
  transactionStatus: string;
  batchStatus: string;
};

export type ApproveBatchItemPayload = {
  id: string;
  externalWmsUrl: string;
  externalWfsUrl?: string;
};

export type ApproveBatchPayload = {
  batchId: string;
  items?: ApproveBatchItemPayload[];
};

export type RejectBatchPayload = {
  batchId: string;
  reason: string;
};

export type BatchLayerDataViewProps = {
  batch: InternalBatchItem;
  onDetailAttribute: (item: CartBatchItem) => void;
};
