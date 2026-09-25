// src\features\shared\types\transaction-detail.type.ts

// src\features\shared\types\transaction-detail.type.ts

import type {
  IgtBasisType,
  SelectionType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  OrderStatus,
  TransactionStatus,
} from "@/shared/types/status.type";
import type { ReactNode } from "react";

export type SharedTransactionMitraInfo = {
  id?: string;
  name: string;
  email: string;
  agencyOrCompany?: string;
};

export type SharedTransactionOrderItem = {
  id: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: IgtBasisType;
  featuresCount?: number;
  snapshotFeaturesCount?: number;
  areaHa?: number;
  snapshotAreaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
  provisionStatus?: OrderStatus;
  proxyWfsUrl?: string;
  proxyWmsUrl?: string;
};

export type SharedTransactionRecord = {
  id: string;
  orderId?: string;
  transactionNumber: string;
  orderNumber?: string;
  billingCode?: string;
  paymentMethod?: string;
  transactionStatus: TransactionStatus;
  orderStatus?: OrderStatus;
  selectionType: SelectionType;
  totalAmount: number;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  billingExpiredAt?: string;
  mitra?: SharedTransactionMitraInfo;
  items: SharedTransactionOrderItem[];
};

export type TransactionDetailTriggerProps = {
  modalKey?: string;
  transaction?: SharedTransactionRecord | null;
  children?: ReactNode;
  showPayButton?: boolean;
};

export type TransactionDetailModalContentProps = {
  transaction: SharedTransactionRecord;
  showPayButton?: boolean;
};
