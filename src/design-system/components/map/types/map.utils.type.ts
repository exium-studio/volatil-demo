// src/design-system/components/map/types/map.utils.type.ts

import type GeoJSON from "geojson";

export type PixelPoint = {
  x: number;
  y: number;
};

export type FlyToSafeOptions = {
  center: [number, number];
  zoom?: number;
  duration?: number;
  pitch?: number;
  bearing?: number;
};

export type FitBoundsSafeOptions = {
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  maxZoom?: number;
  duration?: number;
};

export type ShpWorkerResult =
  | { ok: true; data: GeoJSON.FeatureCollection }
  | { ok: false; error: string };
