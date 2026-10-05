// src/features/mitra/data-request/types/fly-to-layer.type.ts

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import type GeoJSON from "geojson";

export type FlyToIgtLayerOptions = {
  cqlFilter?: string;
  geojson?: GeoJSON.Feature | GeoJSON.FeatureCollection | GeoJSON.Geometry;
  aoiPolygon?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  bbox?: [number, number, number, number] | null;
};

export type FlyToLayerTarget =
  | IgtLayerItem
  | {
      id: string;
      title?: string | null;
      bbox?: [number, number, number, number] | null;
      wfs?: {
        wfsTypeName: string;
        wfsUrl?: string | null;
      };
      spatialBasis?: "bidang" | "kawasan";
      data?: unknown;
      geojson?: GeoJSON.Feature | GeoJSON.FeatureCollection | GeoJSON.Geometry;
      geometry?: GeoJSON.Geometry;
      polygon?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
    };
