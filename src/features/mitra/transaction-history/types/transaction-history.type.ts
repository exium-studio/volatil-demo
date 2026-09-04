// src/features/mitra/transaction-history/types/transaction-history.type.ts

import type {
  SelectionType,
  SpatialBasisType,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { PaginationMeta } from "@/shared/types/common-response.type";

import type {
  OrderStatus,
  TransactionStatus,
} from "@/shared/types/status.type";

export type { TransactionStatus };
export type OrderProvisionStatus = OrderStatus;

export type TransactionOrderItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: SpatialBasisType;
  snapshotFeaturesCount: number;
  snapshotAreaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  provisionStatus: OrderProvisionStatus;
  proxyWfsUrl?: string;
  proxyWmsUrl?: string;
};

export type TransactionRecord = {
  id: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  paymentMethod: string;
  transactionStatus: TransactionStatus;
  selectionType: SelectionType;
  totalAmount: number;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  items: TransactionOrderItem[];
};

export type TransactionHistoryQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: TransactionStatus;
};

export type TransactionHistoryResponse = {
  items: TransactionRecord[];
  pagination: PaginationMeta;
};
