// src/design-system/components/map/types/base-layer.type.ts

export type BaseLayerStyleKey =
  | "color"
  | "plain-light"
  | "plain-dark"
  | "plain-adaptive"
  | "satellite";

export type BaseLayerOption = {
  thumbnail?: string;
  label: string;
  description: string;
  attributions: string[];
  style: {
    light: string | maplibregl.StyleSpecification;
    dark: string | maplibregl.StyleSpecification;
  };
};
