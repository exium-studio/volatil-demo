// src/design-system/components/map/constants/base-layer-style.constant.ts

import type {
  BaseLayerOption,
  BaseLayerStyleKey,
} from "@/design-system/components/map/types/base-layer.type";
import { IMAGES_PATH } from "@/shared/constants/paths";
import type maplibregl from "maplibre-gl";

export const OPENFREEMAP_LIBERTY_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

const CARTO_POSITRON_STYLE: maplibregl.StyleSpecification = {
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

const CARTO_DARK_MATTER_STYLE: maplibregl.StyleSpecification = {
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

const ESRI_SATELLITE_STYLE: maplibregl.StyleSpecification = {
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

export const BASE_LAYER_MAP = {
  color: {
    thumbnail: `${IMAGES_PATH}/base_map_styles/colorful.png`,
    label: "Color",
    description: "Gaya peta penuh warna OpenFreeMap Liberty",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>',
    ],
    style: {
      light: OPENFREEMAP_LIBERTY_STYLE_URL,
      dark: OPENFREEMAP_LIBERTY_STYLE_URL,
    },
  },
  "plain-light": {
    thumbnail: `${IMAGES_PATH}/base_map_styles/plain_light.png`,
    label: "Plain Light",
    description: "Gaya terang polos CARTO Positron",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
    style: {
      light: CARTO_POSITRON_STYLE,
      dark: CARTO_POSITRON_STYLE,
    },
  },
  "plain-dark": {
    thumbnail: `${IMAGES_PATH}/base_map_styles/plain_dark.png`,
    label: "Plain Dark",
    description: "Gaya gelap polos CARTO Dark Matter",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
    style: {
      light: CARTO_DARK_MATTER_STYLE,
      dark: CARTO_DARK_MATTER_STYLE,
    },
  },
  "plain-adaptive": {
    thumbnail: `${IMAGES_PATH}/base_map_styles/plain_adaptive.png`,
    label: "Plain Adaptive",
    description: "Polos adaptif mengikuti tema aplikasi (Terang/Gelap)",
    attributions: [
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    ],
    style: {
      light: CARTO_POSITRON_STYLE,
      dark: CARTO_DARK_MATTER_STYLE,
    },
  },
  satellite: {
    thumbnail: `${IMAGES_PATH}/base_map_styles/satellite.png`,
    label: "Satellite",
    description: "Citra satelit Esri World Imagery",
    attributions: [
      'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>',
      "Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    ],
    style: {
      light: ESRI_SATELLITE_STYLE,
      dark: ESRI_SATELLITE_STYLE,
    },
  },
} as const satisfies Record<BaseLayerStyleKey, BaseLayerOption>;

export const BASE_LAYER_OPTIONS = Object.keys(
  BASE_LAYER_MAP,
) as BaseLayerStyleKey[];

// -----------------------------------------------------------------

export const getBaseLayerOption = (key: BaseLayerStyleKey): BaseLayerOption =>
  BASE_LAYER_MAP[key];

export const getBaseLayerStyle = (
  key: BaseLayerStyleKey,
  colorMode: "light" | "dark",
): string | maplibregl.StyleSpecification =>
  BASE_LAYER_MAP[key].style[colorMode];
