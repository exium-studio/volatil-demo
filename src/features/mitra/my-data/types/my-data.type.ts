// src/features/mitra/my-data/types/my-data.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";

export type MyDataStatus = "active" | "expired";
export type MyDataSpatialBasis = "bidang" | "kawasan";

export type MyDataItem = {
  id: string;
  title: string;
  spatialBasis: MyDataSpatialBasis;
  wfsUrl: string | null;
  wmsUrl: string | null;
  wfsTypeName?: string;
  wmsLayers?: string;
  status: MyDataStatus;
  expiresAt: string;
  bbox?: [number, number, number, number];
};

export type MyDataQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  basis?: string;
  status?: MyDataStatus;
};

export type MyDataResponse = PaginatedResponse<MyDataItem>;
export type MitraMyDataListProps = StackProps;
