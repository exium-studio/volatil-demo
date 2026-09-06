// src/design-system/components/map/types/map.fetch-wfs.type.ts

import type GeoJSON from "geojson";

export type WfsBbox = [number, number, number, number];

export type WfsVersion = "1.0.0" | "1.1.0" | "2.0.0";

export type GeoServerFeatureCollection = GeoJSON.FeatureCollection & {
  totalFeatures: number;
};

export type FetchWfsParams = {
  typeName: string;
  wfsUrl: string;
  bbox?: WfsBbox;
  cqlFilter?: string;
  version?: WfsVersion;
  srsName?: string;
  maxFeatures?: number;
  startIndex?: number;
  resultType?: "results" | "hits";
  signal?: AbortSignal;
};

export type RawGeoServerResponse = GeoJSON.FeatureCollection & {
  totalFeatures?: number;
  numberMatched?: number;
  numberOfFeatures?: number;
};
