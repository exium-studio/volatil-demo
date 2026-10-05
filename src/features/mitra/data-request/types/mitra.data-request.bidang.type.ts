// src/features/mitra/data-request/types/mitra.data-request.bidang.type.ts

import type GeoJSON from "geojson";

export type BidangAoiLayerItem = {
  id: string;
  typeName: string;
  wfsUrl: string;
  title?: string;
};

export type UseBidangAoiFeaturesParams = {
  aoiPolygon?:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null;
  bidangLayers?: BidangAoiLayerItem[];
  enabled?: boolean;
};

export type UseBidangAoiFeaturesResult = {
  features: GeoJSON.FeatureCollection | null;
  totalFeatures: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};
