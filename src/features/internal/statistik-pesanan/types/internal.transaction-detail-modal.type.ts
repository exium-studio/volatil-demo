// src/features/internal/statistik-pesanan/types/internal.transaction-detail-modal.type.ts

import type { InternalTransactionItem } from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import type { ReactNode } from "react";

export type InternalTransactionDetailTriggerProps = {
  modalKey?: string;
  transaction: InternalTransactionItem;
  children?: ReactNode;
};

export type InternalTransactionDetailModalContentProps = {
  transaction: InternalTransactionItem;
  close?: () => void;
};
