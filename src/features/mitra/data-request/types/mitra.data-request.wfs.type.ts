// src/features/mitra/data-request/types/mitra.data-request.wfs.type.ts

import type GeoJSON from "geojson";

export type WfsBidangProperties = Record<string, string | number | null> &
  Record<string, unknown>;

export type WfsFeatureItem = GeoJSON.Feature<
  GeoJSON.Geometry,
  WfsBidangProperties
>;

export type LayerCountSummary = {
  spatialBasis: "bidang" | "kawasan";
  totalCount: number;
  totalAreaHa: number;
  label: string;
};

export type FetchWfsCatalogParams = {
  typeName?: string;
  wfsUrl?: string;
  page: number;
  pageSize: number;
  cqlFilter?: string;
  search?: string;
  signal?: AbortSignal;
};

export type FetchWfsCatalogResult = {
  features: GeoJSON.Feature[];
  totalFeatures: number;
  totalLuas: number;
  bidangCount: number;
  kawasanCount: number;
};

export type UseIgtWfsCatalogParams = Omit<FetchWfsCatalogParams, "signal">;

export type WfsFilterParams = {
  typeName: string;
  wfsUrl: string;
  filters?: Record<string, string | undefined>;
  startIndex?: number;
  count?: number;
  signal?: AbortSignal;
};

export type WfsSchemaProperty = {
  name: string;
  type: string;
  localType?: string;
};







