// src/features/mitra/home/types/mitra.home.last-transaction.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type MitraHomeLastTransactionProps = StackProps;

export type MitraHomeTransactionStatus = "success" | "pending" | "failed";
export type MitraHomeThemeType = "rtr" | "boundary" | "land";
export type MitraHomeDataStatus = "active" | "inactive";
export type MitraHomeThemeCategory = "spatial" | "land";

export type MitraHomeTransactionItem = Record<string, unknown> & {
  id: string;
  transactionNo: string;
  username: string;
  date: string;
  status: MitraHomeTransactionStatus;
  dataName: string;
  themeType: MitraHomeThemeType;
  apiLink: string;
  apiWps: string;
  timeLeft: string;
  dataStatus: MitraHomeDataStatus;
  quota: string;
  themeCategory: MitraHomeThemeCategory;
  description: string;
  amount: number;
};

// Aliases for compatibility
export type TransactionStatus = MitraHomeTransactionStatus;
export type ThemeType = MitraHomeThemeType;
export type DataStatus = MitraHomeDataStatus;
export type ThemeCategory = MitraHomeThemeCategory;
export type TransactionItem = MitraHomeTransactionItem;
