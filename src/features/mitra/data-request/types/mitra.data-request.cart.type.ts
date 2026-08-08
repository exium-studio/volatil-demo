// src/features/mitra/data-request/types/mitra.data-request.cart.type.ts

import type GeoJSON from "geojson";

export type MitraDataRequestAddToCartTargetBasis = "all" | "bidang" | "kawasan";

export type MitraDataRequestAddToCartSource =
  | "catalog"
  | "draw_aoi"
  | "upload_aoi";

export type MitraDataRequestAddSelectedPayload = {
  itemIds: string[];
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
