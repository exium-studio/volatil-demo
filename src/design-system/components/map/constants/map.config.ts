// src/design-system/components/map/constants/map.config.ts

import type { LayerSpecification } from "maplibre-gl";
import type { WfsLayerConfig } from "@/design-system/components/map/types/map.type";
import { DEFAULT_ACTIVE_IGT_BBOX } from "@/features/mitra/data-request/constants/igt.config";

// ---------------------------------------------------------------------------
// Grouped Module Setting
// ---------------------------------------------------------------------------

// Compute center from default active layer bbox [minLng, minLat, maxLng, maxLat]
const defaultCenter: [number, number] = [
  (DEFAULT_ACTIVE_IGT_BBOX[0] + DEFAULT_ACTIVE_IGT_BBOX[2]) / 2,
  (DEFAULT_ACTIVE_IGT_BBOX[1] + DEFAULT_ACTIVE_IGT_BBOX[3]) / 2,
];

export const MAP_CONFIG = {
  viewport: {
    center: defaultCenter,
    zoom: 14.5,
    bounds: DEFAULT_ACTIVE_IGT_BBOX,
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
