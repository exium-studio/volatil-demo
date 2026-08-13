// src/features/mitra/data-request/types/mitra.data-request.wfs.type.ts

import type GeoJSON from "geojson";

export type WfsBidangProperties = Record<string, string | number | null> &
  Record<string, unknown>;

export type WfsFeatureItem = GeoJSON.Feature<
  GeoJSON.Geometry,
  WfsBidangProperties
>;
