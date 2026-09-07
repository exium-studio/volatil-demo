// src/features/internal/statistik-pesanan/types/internal.transaction-statistic.type.ts

import type { SelectionType } from "@/features/mitra/cart/types/mitra.cart.order.type";
import type { PaginationMeta } from "@/shared/types/common-response.type";
import type {
  OrderStatus,
  TransactionStatus,
} from "@/shared/types/status.type";

export type { OrderStatus, TransactionStatus };

export type InternalTransactionStatistics = {
  activeOrders: number;
  settledTransactions: number;
  netWorth: number;
};

export type InternalTransactionMitra = {
  id: string;
  name: string;
  email: string;
  agencyOrCompany?: string;
};

export type InternalTransactionOrderItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: "bidang" | "kawasan";
  snapshotFeaturesCount: number;
  snapshotAreaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  provisionStatus: OrderStatus;
};

export type InternalTransactionItem = {
  id: string;
  orderId: string;
  transactionNumber: string;
  orderNumber?: string;
  billingCode: string;
  paymentMethod: string;
  transactionStatus: TransactionStatus;
  orderStatus: OrderStatus;
  selectionType: SelectionType;
  totalAmount: number;
  mitra: InternalTransactionMitra;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  billingExpiredAt?: string;
  itemsCount: number;
  items: InternalTransactionOrderItem[];
};

export type InternalTransactionQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  transactionStatus?: TransactionStatus;
  orderStatus?: OrderStatus;
  selectionType?: SelectionType;
  startDate?: string;
  endDate?: string;
};

export type InternalTransactionListResponse = {
  items: InternalTransactionItem[];
  pagination: PaginationMeta;
};
