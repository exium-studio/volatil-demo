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
  /** GeoServer qualified layer typeName (e.g. 'workspace:layer_name' or 'workspace') */
  typeName?: string;
  /** Human-readable title of the layer */
  title?: string;
  /** IGT Basis of this layer ("bidang" or "kawasan"). */
  igtBasis?: "bidang" | "kawasan";
  /** Spatial basis alias for backward compatibility */
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
  wmsUrl?: string | null;
  wfsUrl?: string | null;
  wfsTypeName?: string;
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
  url?: string;
  baseUrl?: string;
  wfsTypeName: string;
  wfsUrl: string;
  type: "wfs-fill" | "wfs-line" | "wfs-circle" | "wfs-symbol";
  version: string;
  srsName: string;
};

/** WMS-specific tile rendering configuration for an IGT layer */
export type IgtLayerWmsConfig = {
  url?: string;
  baseUrl?: string;
  layers: string;
  wmsUrl: string;
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
  workspaceName?: string;
  layerName?: string | null;
  typeName?: string;
  title: string;
  igtBasis: "bidang" | "kawasan";
  spatialBasis: "bidang" | "kawasan";
  bbox: [number, number, number, number];
  visible: boolean;
  defaultVisible: boolean;
  zIndex: number;
  wfs: IgtLayerWfsConfig;
  wms: IgtLayerWmsConfig;
};

import type { PaginationMeta } from "@/shared/types/common-response.type";

export type MapLibreInternalMap = maplibregl.Map & {
  style?: unknown;
  _removed?: boolean;
};

export type MapLibreRasterSource = maplibregl.RasterTileSource & {
  tiles?: string[];
};

export const isMapActive = (
  map: maplibregl.Map | null,
): map is MapLibreInternalMap => {
  if (!map) return false;
  const internal = map as unknown as { style?: unknown; _removed?: boolean };
  return Boolean(internal.style && !internal._removed);
};

export type IgtLayersResponse = {
  items: IgtLayerItem[];
  pagination: PaginationMeta;
};

/** Helper converter to build WmsRasterLayerConfig for map rendering from an IgtLayerItem */
export const getWmsRasterConfigFromIgtLayer = (
  igtLayer: IgtLayerItem,
  visible = true,
  opacity = 0.5,
): WmsRasterLayerConfig => {
  const wmsUrl = igtLayer.wms?.wmsUrl ?? "";
  const layers = igtLayer.wms?.layers || igtLayer.typeName || "";
  const wfsUrl = igtLayer.wfs?.wfsUrl;
  const wfsTypeName = igtLayer.wfs?.wfsTypeName || igtLayer.typeName || "";

  return {
    id: igtLayer.id,
    typeName: igtLayer.typeName || layers || wfsTypeName,
    title: igtLayer.title,
    type: "wms-raster",
    spatialBasis: igtLayer.spatialBasis,
    bbox: igtLayer.bbox,
    visible,
    opacity,
    zIndex: igtLayer.zIndex,
    wmsUrl,
    layers,
    wfsUrl,
    wfsTypeName,
    tileSize: igtLayer.wms?.tileSize,
    format: igtLayer.wms?.format,
    transparent: igtLayer.wms?.transparent,
    styles: igtLayer.wms?.styles,
  };
};

export type UseGeolocationResult = {
  isActive: boolean;
  isLocating: boolean;
  locationError: string | null;
  toggle: () => void;
};

export type MapViewPaddingOptions = {
  contentPanelRef: import("react").RefObject<HTMLDivElement | null>;
  sidebarPx: number;
  isVertical: boolean;
};

export type MapDrawStore = {
  geometryType: DrawGeometryType;
  isDrawing: boolean;
  points: DrawPoint[];
  start: (geometryType: DrawGeometryType) => void;
  addPoint: (point: DrawPoint) => void;
  finish: () => void;
  cancel: () => void;
};

export type MapInstanceState = {
  map: import("maplibre-gl").Map | null;
  setMap: (map: import("maplibre-gl").Map | null) => void;
};

export type MapInteractionStore = {
  isRotationLocked: boolean;
  toggleRotationLock: () => void;
  setRotationLocked: (locked: boolean) => void;
};

export type MapLayerState = {
  wmsVisible: boolean;
  setWmsVisible: (visible: boolean) => void;
  globalOpacity: number;
  setGlobalOpacity: (opacity: number) => void;
  enabledLayerIds: Record<string, boolean>;
  layerOpacities: Record<string, number>;
  enabledSymbologyLayerIds: Record<string, boolean>;
  customLayerConfigs: Record<string, Partial<WmsRasterLayerConfig>>;
  toggleLayerId: (layerId: string) => void;
  setLayerEnabled: (layerId: string, enabled: boolean) => void;
  toggleSymbologyLayerId: (layerId: string) => void;
  setSymbologyLayerEnabled: (layerId: string, enabled: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setAllLayersEnabled: (layerIds: string[], enabled: boolean) => void;
  setCustomLayerConfig: (
    layerId: string,
    config: Partial<WmsRasterLayerConfig> | null,
  ) => void;
  resetLayers: () => void;
};

export type MapOverlayProps = {
  showMasterIgtLayerSelect?: boolean;
  showMyDataLayerSelect?: boolean;
};
