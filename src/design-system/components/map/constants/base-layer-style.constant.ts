// src/design-system/components/map/constants/base-layer-style.constant.ts

import type maplibregl from "maplibre-gl";

export type BaseLayerStyleKey =
  | "color"
  | "plain-light"
  | "plain-dark"
  | "plain-adaptive"
  | "satellite";

export interface BaseLayerOption {
  id: BaseLayerStyleKey;
  label: string;
  description: string;
  attributions: string[];
}

export const BASE_LAYER_OPTIONS: BaseLayerOption[] = [
  {
    id: "color",
    label: "Color",
    description: "Gaya peta penuh warna OpenFreeMap Liberty",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>',
    ],
  },
  {
    id: "plain-light",
    label: "Plain Light",
    description: "Gaya terang polos CARTO Positron",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
  },
  {
    id: "plain-dark",
    label: "Plain Dark",
    description: "Gaya gelap polos CARTO Dark Matter",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
  },
  {
    id: "plain-adaptive",
    label: "Plain Adaptive",
    description: "Polos adaptif mengikuti tema aplikasi (Terang/Gelap)",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
  },
  {
    id: "satellite",
    label: "Satellite",
    description: "Citra satelit Esri World Imagery",
    attributions: [
      'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>',
      "Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    ],
  },
];

/** OpenFreeMap Liberty — full-color vector style, same as the original default. */
export const OPENFREEMAP_LIBERTY_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

export const CARTO_POSITRON_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "CARTO Positron",
  sources: {
    "carto-positron": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-positron-layer",
      type: "raster",
      source: "carto-positron",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export const CARTO_DARK_MATTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "CARTO Dark Matter",
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export const ESRI_SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "Esri Satellite",
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  },
  layers: [
    {
      id: "esri-satellite-layer",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

/**
  Returns the MapLibre GL style definition based on selected basemap ID and current theme color mode.
 */
export const getBaseLayerStyle = (
  styleKey: BaseLayerStyleKey,
  colorMode: "light" | "dark",
): maplibregl.StyleSpecification => {
  switch (styleKey) {
    case "color":
      // OpenFreeMap Liberty is a URL-based style, handled separately in BaseMap
      return CARTO_POSITRON_STYLE; // fallback — overridden by string URL in BaseMap
    case "plain-light":
      return CARTO_POSITRON_STYLE;
    case "plain-dark":
      return CARTO_DARK_MATTER_STYLE;
    case "plain-adaptive":
      return colorMode === "dark"
        ? CARTO_DARK_MATTER_STYLE
        : CARTO_POSITRON_STYLE;
    case "satellite":
      return ESRI_SATELLITE_STYLE;
    default:
      return CARTO_POSITRON_STYLE;
  }
};
