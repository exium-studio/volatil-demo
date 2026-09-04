// src/features/internal/order-review/types/order-review.type.ts

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

import { z } from "zod";

export type ApproveOrderItemPayload = {
  id: string;
  externalWmsUrl: string;
  externalWfsUrl?: string;
};

export const approveOrderItemSchema = z.object({
  id: z.string(),
  externalWmsUrl: z
    .string()
    .trim()
    .min(1, "URL WMS dari INTEROP wajib diisi"),
  externalWfsUrl: z.string().optional(),
});

export const approveOrderFormSchema = z.object({
  items: z.array(approveOrderItemSchema),
});

export type ApproveOrderItemFormValues = z.infer<typeof approveOrderItemSchema>;
export type ApproveOrderFormValues = z.infer<typeof approveOrderFormSchema>;

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
