// src/features/home/types/home.last-transaction.type.ts

export type TransactionStatus = "success" | "pending" | "failed";

export interface TransactionItem extends Record<string, unknown> {
  id: string;
  transactionNo: string;
  date: string;
  description: string;
  paymentMethod: string;
  amount: number;
  status: TransactionStatus;
}
