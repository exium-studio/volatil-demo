// src/design-system/components/map/types/basemap.select.type.ts

export type BaseLayerStyleKey =
  | "color"
  | "plain-light"
  | "plain-dark"
  | "plain-adaptive"
  | "satellite"
  | "topo";

export type BaseLayerOption = {
  thumbnail?: string;
  label: string;
  description: string;
  attributions: string[];
  style: {
    light: string | maplibregl.StyleSpecification;
    dark: string | maplibregl.StyleSpecification;
  };
  maxZoom: number;
};
