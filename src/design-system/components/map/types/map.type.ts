// src/design-system/components/map/types/map.type.ts

/** Geometry types supported by the draw feature. Only "polygon" is exposed in the UI for now. */
export type DrawGeometryType = "polygon" | "line" | "point";

export interface DrawPoint {
  lng: number;
  lat: number;
}

/** Discriminated union describing every layer that can be added to the map via config. */
export type MapLayerConfig =
  | WfsLayerConfig
  | RasterTileLayerConfig
  | VectorTileLayerConfig;

interface BaseLayerConfig {
  id: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
}

export interface WfsLayerConfig extends BaseLayerConfig {
  type: "wfs-fill" | "wfs-line" | "wfs-circle" | "wfs-symbol";
  wfsTypeName: string;
}

export interface RasterTileLayerConfig extends BaseLayerConfig {
  type: "raster-tile";
  tileUrl: string;
  tileSize?: number;
}

export interface VectorTileLayerConfig extends BaseLayerConfig {
  type: "vector-tile";
  tileUrl: string;
  sourceLayer: string;
}
