// src/features/mitra/transaction-history/types/transaction-history.modal.type.ts

import type { TransactionRecord } from "@/features/mitra/transaction-history/types/transaction-history.type";
import type React from "react";

export type TransactionDetailTriggerProps = {
  modalKey?: string;
  transaction?: TransactionRecord | null;
  children: React.ReactNode;
};

export type TransactionDetailModalContentProps = {
  transaction: TransactionRecord;
  close: () => void;
};
