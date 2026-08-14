// src/design-system/components/map/types/map.type.ts

/** Geometry types supported by the draw feature. Only "polygon" is exposed in the UI for now. */
export type DrawGeometryType = "polygon" | "line" | "point";

export type DrawPoint = {
  lng: number;
  lat: number;
};

export type MapServerEndpoint = {
  id: string;
  name: string;
  wfsUrl: string;
  wmsUrl: string;
  wfsVersion?: string;
  wmsVersion?: string;
  outputFormat?: string;
  srsName?: string;
};

/** Discriminated union describing every layer that can be added to the map via config. */
export type MapLayerConfig =
  | WfsLayerConfig
  | RasterTileLayerConfig
  | VectorTileLayerConfig
  | WmsRasterLayerConfig;

export type BaseLayerConfig = {
  id: string;
  /** When false the layer is added but hidden (layout visibility "none"). Defaults to true. */
  visible?: boolean;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
};

export type WfsLayerConfig = BaseLayerConfig & {
  type: "wfs-fill" | "wfs-line" | "wfs-circle" | "wfs-symbol";
  wfsTypeName: string;
  /** Optional per-layer WFS endpoint override. Defaults to server endpoint wfsUrl. */
  wfsUrl?: string;
  version?: string;
  srsName?: string;
};

export type RasterTileLayerConfig = BaseLayerConfig & {
  type: "raster-tile";
  tileUrl: string;
  tileSize?: number;
};

export type VectorTileLayerConfig = BaseLayerConfig & {
  type: "vector-tile";
  tileUrl: string;
  sourceLayer: string;
};

export type WmsRasterLayerConfig = BaseLayerConfig & {
  type: "wms-raster";
  /** Full tile URL template, or constructed dynamically using wmsUrl & layers */
  tileUrl?: string;
  wmsUrl?: string;
  layers?: string;
  tileSize?: number;
  srs?: string;
  version?: string;
  format?: string;
  transparent?: boolean;
};

export type IgtLayersResponse = {
  wfs: WfsLayerConfig[];
  wms: WmsRasterLayerConfig[];
};
