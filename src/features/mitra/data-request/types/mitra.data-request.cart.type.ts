// src/features/mitra/data-request/types/mitra.data-request.cart.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type GeoJSON from "geojson";

export type MitraDataRequestAddToCartTargetBasis = "all" | "bidang" | "kawasan";

export type MitraDataRequestAddToCartSource =
  | "catalog"
  | "draw_aoi"
  | "upload_aoi";

export type MitraDataRequestAddSelectedPayload = {
  itemIds: string[];
  features?: GeoJSON.Feature[];
};

export type MitraDataRequestAddAllPayload = {
  source: MitraDataRequestAddToCartSource;
  targetBasis?: MitraDataRequestAddToCartTargetBasis;
  search?: string;
  geometry?: GeoJSON.Polygon;
  fileId?: string;
};

export type MitraDataRequestAddToCartResponse = {
  success: boolean;
  addedCount: number;
  message?: string;
};

export type MitraDataRequestAddToCartButtonsProps = StackProps & {
  spatialBasis?: "bidang" | "kawasan";
  cqlFilter?: string;
  selectedItems?: FormattedListItem[];
  allItems?: MitraDataRequestIgtDataItem[] | unknown[];
  totalBidangCount?: number;
  totalKawasanCount?: number;
  totalKawasanAreaHa?: number;
  totalCount?: number;
  minBidangCount?: number;
  minKawasanHa?: number;
  pricePerBidang?: number;
  pricePerKawasanHa?: number;
  onAddAllBidangClick?: () => void;
  onAddAllKawasanClick?: () => void;
  onAddAllBothClick?: () => void;
  onAddSelectedClick?: () => void;
};

export type AddToCartLayerParam = {
  layerId: string;
  typeName: string;
  title?: string;
  spatialBasis?: "bidang" | "kawasan";
  selectionType?: "catalog" | "upload_aoi" | "draw_aoi";
  featuresCount?: number;
  areaHa?: number;
  cqlFilter?: string;
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
};


