// src/design-system/components/map/constants/map-base-layer-style.constant.ts

import type {
  BaseLayerOption,
  BaseLayerStyleKey,
} from "@/design-system/components/map/types/base-layer.type";
import { IMAGES_PATH } from "@/shared/constants/paths";
import type maplibregl from "maplibre-gl";

export const OPENFREEMAP_LIBERTY_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

// -----------------------------------------------------------------
// Max zoom per provider — declared once, reused in both the style's
// source/layer config AND the option's `maxZoom` field below, so there's
// only one number to update per provider.
//
// - CARTO raster (Positron/Dark Matter): officially supports z0–20.
// - Esri World Imagery: real-world satellite coverage varies by region —
//   many areas have no data past z19, so 19 is the safe global default
//   (higher zooms overzoom visually instead of requesting missing tiles).
// - Vector styles (OpenFreeMap Liberty) don't have this problem — geometry
//   scales without quality loss, so no cap needed here.

const SOURCE_CARTO_MAX_ZOOM = 20;
const SOURCE_ESRI_MAX_ZOOM = 17;

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
      maxzoom: SOURCE_CARTO_MAX_ZOOM,
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
      maxzoom: 24,
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
      maxzoom: SOURCE_CARTO_MAX_ZOOM,
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
      maxzoom: 24,
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
      maxzoom: SOURCE_ESRI_MAX_ZOOM,
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    "terrain-dem": {
      type: "raster-dem",
      tiles: [
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      ],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 15,
    },
  },
  layers: [
    {
      id: "esri-satellite-layer",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 24,
    },
  ],
};

const TOPO_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "OpenTopoMap Terrain",
  sources: {
    opentopomap: {
      type: "raster",
      tiles: [
        "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
        "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
        "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 17,
      attribution:
        "Kartografi &copy; OpenTopoMap (CC-BY-SA), SRTM | Map data &copy; OpenStreetMap contributors",
    },
    "terrain-dem": {
      type: "raster-dem",
      tiles: [
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      ],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 15,
    },
  },
  layers: [
    {
      id: "opentopomap-layer",
      type: "raster",
      source: "opentopomap",
      minzoom: 0,
      maxzoom: 24,
    },
  ],
};

export const MAP_BASE_LAYER_MAP = {
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
    maxZoom: 24,
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
    maxZoom: 24,
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
    maxZoom: 24,
  },

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
    maxZoom: 24,
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
    maxZoom: 24,
  },

  topo: {
    thumbnail: `${IMAGES_PATH}/base_map_styles/plain_adaptive.png`, // Fallback using an existing thumbnail
    label: "Terrain/Topo",
    description: "Peta topografi 3D dengan kontur ketinggian",
    attributions: [
      'Kartografi &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA</a>)',
      'Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      'DEM &copy; <a href="https://github.com/tilezen/joerd" target="_blank" rel="noopener noreferrer">Tilezen Joerd</a>',
    ],
    style: {
      light: TOPO_STYLE,
      dark: TOPO_STYLE,
    },
    maxZoom: 24,
  },
} as const satisfies Record<BaseLayerStyleKey, BaseLayerOption>;

export const MAP_BASE_LAYER_OPTIONS = Object.keys(
  MAP_BASE_LAYER_MAP,
) as BaseLayerStyleKey[];

// -----------------------------------------------------------------

export const getBaseLayerOption = (key: BaseLayerStyleKey): BaseLayerOption =>
  MAP_BASE_LAYER_MAP[key];

export const getBaseLayerStyle = (
  key: BaseLayerStyleKey,
  colorMode: "light" | "dark",
): string | maplibregl.StyleSpecification =>
  MAP_BASE_LAYER_MAP[key].style[colorMode];
