// src/features/mitra/my-data/types/my-data.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";

export type MyDataStatus = "active" | "expired";
export type MyDataTransactionStatus = "pending" | "settled" | "failed";

export type MyDataItem = {
  id: string;
  name: string;
  basis: "bidang" | "kawasan";
  purchasedBy: {
    id: string;
    name: string;
    email: string;
  };
  transactionDate: string;
  transactionSettledAt: string | null;
  transactionStatus: MyDataTransactionStatus;
  wfsUrl: string | null;
  expiresAt: string;
  status: MyDataStatus;
};

export type MyDataQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  basis?: string;
  tema?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  status: MyDataStatus;
};

export type MyDataResponse = PaginatedResponse<MyDataItem>;
export type MitraMyDataListProps = StackProps;
