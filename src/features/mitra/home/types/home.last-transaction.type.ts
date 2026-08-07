// src/features/mitra/home/types/home.last-transaction.type.ts

export type TransactionStatus = "success" | "pending" | "failed";
export type ThemeType = "rtr" | "boundary" | "land";
export type DataStatus = "active" | "inactive";
export type ThemeCategory = "spatial" | "land";

export interface TransactionItem extends Record<string, unknown> {
  id: string;
  transactionNo: string;
  username: string;
  date: string;
  status: TransactionStatus;
  dataName: string;
  themeType: ThemeType;
  apiLink: string;
  apiWps: string;
  timeLeft: string;
  dataStatus: DataStatus;
  quota: string;
  themeCategory: ThemeCategory;
  description: string;
  amount: number;
}
