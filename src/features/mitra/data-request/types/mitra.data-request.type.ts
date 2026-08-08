// src/features/mitra/data-request/types/mitra.data-request.type.ts

import type { DataListTableRootProps } from "@/design-system/components/data-display/types/data-list-table.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { ReactNode } from "react";
import type { PaginatedResponse } from "@/shared/types/common-response.type";

export type MitraDataRequestIgtDataResponse =
  PaginatedResponse<MitraDataRequestIgtDataItem>;

// Aliases for compatibility
export type IgtDataResponse = MitraDataRequestIgtDataResponse;

export type MitraIgtDataListTableProps = Omit<
  DataListTableRootProps,
  "headers" | "items" | "children"
> & {
  igtItems: MitraDataRequestIgtDataItem[];
  children?: ReactNode;
};
