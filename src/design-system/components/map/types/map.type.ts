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
  /** Spatial basis of this IGT layer ("bidang" or "kawasan"). */
  spatialBasis?: "bidang" | "kawasan";
  /** Bounding box of the layer [minLon, minLat, maxLon, maxLat]. */
  bbox?: [number, number, number, number];
  /** When false the layer is added but hidden (layout visibility "none"). Defaults to true. */
  visible?: boolean;
  /** Opacity of the layer (0 to 1). Defaults to 1. */
  opacity?: number;
  /** Layer stacking order index (lower = bottom, higher = top). */
  zIndex?: number;
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
  styles?: string;
};

/** WFS-specific query configuration for an IGT layer */
export type IgtLayerWfsConfig = {
  wfsTypeName: string;
  wfsUrl?: string;
  type?: "wfs-fill" | "wfs-line" | "wfs-circle" | "wfs-symbol";
  version?: string;
  srsName?: string;
};

/** WMS-specific tile rendering configuration for an IGT layer */
export type IgtLayerWmsConfig = {
  layers: string;
  wmsUrl?: string;
  tileSize?: number;
  format?: string;
  transparent?: boolean;
  styles?: string;
  version?: string;
  srs?: string;
};

/** Centralized IGT Layer Item containing metadata, WFS query config, and WMS render config */
export type IgtLayerItem = {
  id: string;
  title?: string;
  spatialBasis: "bidang" | "kawasan";
  bbox?: [number, number, number, number];
  visible?: boolean;
  zIndex?: number;
  wfs: IgtLayerWfsConfig;
  wms: IgtLayerWmsConfig;
};

import type { PaginationMeta } from "@/shared/types/common-response.type";

export type IgtLayersResponse = {
  items: IgtLayerItem[];
  pagination?: PaginationMeta;
  /** @deprecated fallback if returned as raw array */
  layers?: IgtLayerItem[];
};

/** Helper converter to build WmsRasterLayerConfig for map rendering from an IgtLayerItem */
export const getWmsRasterConfigFromIgtLayer = (
  igtLayer: IgtLayerItem,
  visible = true,
  opacity = 0.5,
): WmsRasterLayerConfig => ({
  id: igtLayer.id,
  type: "wms-raster",
  spatialBasis: igtLayer.spatialBasis,
  bbox: igtLayer.bbox,
  visible,
  opacity,
  zIndex: igtLayer.zIndex,
  wmsUrl: igtLayer.wms?.wmsUrl ?? "",
  layers: igtLayer.wms?.layers ?? "",
  tileSize: igtLayer.wms?.tileSize,
  format: igtLayer.wms?.format,
  transparent: igtLayer.wms?.transparent,
  styles: igtLayer.wms?.styles,
});
