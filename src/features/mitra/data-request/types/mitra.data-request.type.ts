// src/features/mitra/data-request/types/mitra.data-request.type.ts

import type { DataViewTableRootProps } from "@/design-system/components/data-display/types/data-view-table.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";
import type { ReactNode } from "react";

export type MitraDataRequestIgtDataResponse =
  PaginatedResponse<MitraDataRequestIgtDataItem>;

// Aliases for compatibility
export type IgtDataResponse = MitraDataRequestIgtDataResponse;

export type MitraIgtDataViewTableProps = Omit<
  DataViewTableRootProps,
  "headers" | "items" | "children"
> & {
  igtItems: MitraDataRequestIgtDataItem[];
  children?: ReactNode;
};

export type MitraDataRequestGetCatalogParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

