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

export type ApproveBatchPayload = {
  batchId: string;
};

export type RejectBatchPayload = {
  batchId: string;
  reason: string;
};

export type BatchLayerDataViewProps = {
  batch: InternalBatchItem;
  onDetailAttribute: (item: CartBatchItem) => void;
};
