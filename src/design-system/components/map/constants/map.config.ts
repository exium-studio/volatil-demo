// src/design-system/components/map/constants/map.config.ts

import type { LayerSpecification } from "maplibre-gl";
import type {
  MapLayerConfig,
  MapServerEndpoint,
  WfsLayerConfig,
} from "@/design-system/components/map/types/map.type";

// ---------------------------------------------------------------------------
// Grouped Module Setting (_CONFIG)
// ---------------------------------------------------------------------------

export const MAP_CONFIG = {
  viewport: {
    // center: [106.8272, -6.1754] as [number, number], // Monumen Nasional (Monas), Jakarta
    center: [115.1597, -8.6626] as [number, number], // Kerobokan Kelod, Kuta Utara, Badung, Bali (igt:CONTOH_BIDANG_TANAH)
    zoom: 13,
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
// Map Server Endpoints List (_LIST)
// ---------------------------------------------------------------------------

export const MAP_SERVER_ENDPOINTS_LIST: MapServerEndpoint[] = [
  {
    id: "igt-geoserver",
    name: "GeoServer IGT Workspace",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/wms",
    wfsVersion: "1.0.0",
    wmsVersion: "1.1.1",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  },
  {
    id: "testing-geoserver",
    name: "GeoServer Testing Workspace",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wfs",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
    wfsVersion: "1.0.0",
    wmsVersion: "1.1.1",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  },
];

export const DEFAULT_MAP_SERVER_ENDPOINT = MAP_SERVER_ENDPOINTS_LIST[0];

// ---------------------------------------------------------------------------
// WMS & WFS Defaults (Legacy compatibility)
// ---------------------------------------------------------------------------

export const WMS_BASE_URL = DEFAULT_MAP_SERVER_ENDPOINT.wmsUrl;
export const WMS_VERSION = DEFAULT_MAP_SERVER_ENDPOINT.wmsVersion ?? "1.1.1";
export const WMS_SRS = "EPSG:3857";
export const WMS_LAYER_NAME = "igt:CONTOH_BIDANG_TANAH";

export const WFS_BASE_URL = DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl;
export const WFS_VERSION = DEFAULT_MAP_SERVER_ENDPOINT.wfsVersion ?? "1.0.0";
export const WFS_OUTPUT_FORMAT =
  DEFAULT_MAP_SERVER_ENDPOINT.outputFormat ?? "application/json";
export const WFS_SRS_NAME = DEFAULT_MAP_SERVER_ENDPOINT.srsName ?? "EPSG:4326";
export const WFS_LAYER_NAME = "igt:CONTOH_BIDANG_TANAH";

// ---------------------------------------------------------------------------
// Default Map Layers List (_LIST)
// ---------------------------------------------------------------------------

export const DEFAULT_MAP_LAYERS_LIST: MapLayerConfig[] = [
  {
    id: "igt-bidang-tanah-wms-raster",
    type: "wms-raster",
    wmsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wmsUrl,
    layers: WMS_LAYER_NAME,
    visible: true,
  },
  // {
  //   id: "igt-bidang-tanah-wfs-fill",
  //   type: "wfs-fill",
  //   wfsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl,
  //   wfsTypeName: WFS_LAYER_NAME,
  //   paint: {
  //     "fill-color": "#f59e0b",
  //     "fill-opacity": 0.15,
  //   },
  //   visible: true,
  // },
  // {
  //   id: "igt-bidang-tanah-wfs-line",
  //   type: "wfs-line",
  //   wfsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl,
  //   wfsTypeName: WFS_LAYER_NAME,
  //   paint: {
  //     "line-color": "#f59e0b",
  //     "line-width": 1,
  //     "line-opacity": 0.8,
  //   },
  //   visible: true,
  // },
];

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
