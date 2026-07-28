// src/design-system/components/map/types/map.basemap-select.type.ts

export type BasemapKey =
  | "color"
  | "plain-light"
  | "plain-dark"
  | "plain-adaptive"
  | "satellite"
  | "topo";

export type BasemapOption = {
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
