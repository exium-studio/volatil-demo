// src/features/mitra/data-request/types/mitra.data-request.coverage.type.ts

import type GeoJSON from "geojson";

export type KawasanCoverageResult = {
  coveragePolygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
  totalAreaHa: number;
  totalIntersectedFeatures: number;
  isEmpty: boolean;
};

export type KawasanCoverageLayerItem = {
  id: string;
  typeName: string;
  wfsUrl: string;
  title?: string;
};

export type UseKawasanCoverageParams = {
  aoiPolygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.Polygon | GeoJSON.MultiPolygon | null | undefined;
  kawasanLayers?: KawasanCoverageLayerItem[];
  enabled?: boolean;
};

export type UseKawasanCoverageResult = {
  coveragePolygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
  totalAreaHa: number;
  totalIntersectedFeatures: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
