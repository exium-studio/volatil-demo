// src/features/mitra/purchase-history/types/purchase-history.type.ts

import type { OrderStatus, ProvisionStatus, SelectionType, SpatialBasisType } from "@/features/mitra/cart/types/mitra.cart.api.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";

export type PaymentMethod = "MPN_GEN2" | "QRIS" | "VA_BANK" | "TELLER_POS";
export type TransactionStatus = "pending" | "settled" | "expired" | "failed";

export type TransactionOrderItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  selectionType: SelectionType;
  snapshotFeaturesCount: number;
  snapshotAreaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  provisionStatus?: ProvisionStatus;
  proxyWfsUrl?: string;
  proxyWmsUrl?: string;
};

export type TransactionRecord = {
  id: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  paymentMethod: PaymentMethod;
  transactionStatus: TransactionStatus;
  orderStatus: OrderStatus;
  totalAmount: number;
  createdAt: string;
  paidAt: string | null;
  expiredAt: string;
  ordersCount: number;
  items: TransactionOrderItem[];
};

export type PurchaseHistoryQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
};

export type PurchaseHistoryResponse = PaginatedResponse<TransactionRecord>;
