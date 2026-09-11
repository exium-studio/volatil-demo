// src/design-system/components/map/constants/map.config.ts

import type { LayerSpecification } from "maplibre-gl";
import type { WfsLayerConfig } from "@/design-system/components/map/types/map.type";

// ---------------------------------------------------------------------------
// Grouped Module Setting
// ---------------------------------------------------------------------------

// Monumen Nasional (Monas), Jakarta [minLng, minLat, maxLng, maxLat]
export const MONAS_BBOX: [number, number, number, number] = [
  106.8227, -6.1805, 106.8335, -6.1701,
];

const defaultCenter: [number, number] = [106.8272, -6.1754];

export const MAP_CONFIG = {
  viewport: {
    center: defaultCenter,
    zoom: 15.5,
    bounds: MONAS_BBOX,
  },
  basemap: {
    styleUrl: "https://tiles.openfreemap.org/styles/liberty",
  },
  raster: {
    tileSize: 256,
  },
  draw: {
    closeHitRadiusPx: 12,
  },
} as const;

// ---------------------------------------------------------------------------
// Event Names Dictionary (_EVENTS_MAP)
// ---------------------------------------------------------------------------

export const MAP_EVENTS_MAP = {
  styleReady: "map-style-ready",
  layersReady: "map-layers-ready",
} as const;

// ---------------------------------------------------------------------------
// Layer Render Type Map (_MAP)
// ---------------------------------------------------------------------------

/** Maps our semantic WFS layer type to the actual MapLibre render layer type. */
export const WFS_LAYER_RENDER_TYPE_MAP: Record<
  WfsLayerConfig["type"],
  LayerSpecification["type"]
> = {
  "wfs-fill": "fill",
  "wfs-line": "line",
  "wfs-circle": "circle",
  "wfs-symbol": "symbol",
};
