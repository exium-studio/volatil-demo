// src/design-system/components/map/types/map.symbology.type.ts

export type GeoServerSymbolizerPolygon = {
  fill?: string;
  "fill-opacity"?: string;
  stroke?: string;
  "stroke-width"?: string;
  "stroke-opacity"?: string;
};

export type GeoServerSymbolizerLine = {
  stroke?: string;
  "stroke-width"?: string;
  "stroke-opacity"?: string;
  "stroke-linejoin"?: string;
  "stroke-linecap"?: string;
};

export type GeoServerSymbolizerPoint = {
  title?: string;
  url?: string;
  size?: string;
  opacity?: string;
  rotation?: string;
  graphics?: {
    mark?: string;
    fill?: string;
    "fill-opacity"?: string;
    stroke?: string;
    "stroke-width"?: string;
  }[];
};

export type GeoServerSymbolizerRaster = {
  opacity?: string;
  colormap?: {
    type?: string;
    entries?: {
      color?: string;
      quantity?: string;
      label?: string;
      opacity?: string;
    }[];
  };
};

export type GeoServerLegendRule = {
  name?: string;
  title?: string;
  abstract?: string;
  filter?: string;
  symbolizers?: {
    Polygon?: GeoServerSymbolizerPolygon;
    Line?: GeoServerSymbolizerLine;
    Point?: GeoServerSymbolizerPoint;
    Raster?: GeoServerSymbolizerRaster;
  }[];
};

export type GeoServerLegendLayer = {
  layerName: string;
  title?: string;
  rules?: GeoServerLegendRule[];
};

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";

export type GeoServerLegendResponse = {
  Legend?: GeoServerLegendLayer[];
};

export type MapSymbologyPanelProps = {
  layers?: IgtLayerItem[];
};

export type LayerSymbologyContentProps = {
  layer: IgtLayerItem;
};

export type LegendRuleItemProps = {
  rule: GeoServerLegendRule;
  fallbackBasis?: "bidang" | "kawasan";
};

export type PolygonSwatchProps = {
  polygon: GeoServerSymbolizerPolygon;
};

export type LineSwatchProps = {
  line: GeoServerSymbolizerLine;
};

export type PointSwatchProps = {
  point: GeoServerSymbolizerPoint;
};

export type DefaultThematicSwatchProps = {
  basis?: "bidang" | "kawasan";
};

export type FetchLegendGraphicParams = {
  layer: IgtLayerItem;
  signal?: AbortSignal;
};

