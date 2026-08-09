// src/design-system/components/map/constants/map.config.ts

import type { LayerSpecification } from "maplibre-gl";
import type {
  MapLayerConfig,
  MapServerEndpoint,
  WfsLayerConfig,
} from "@/design-system/components/map/types/map.type";

// ---------------------------------------------------------------------------
// Map defaults
// ---------------------------------------------------------------------------

/** Monumen Nasional (Monas), Jakarta — default map center and zoom level on first load. */
export const DEFAULT_MAP_CENTER: [number, number] = [106.8272, -6.1754];
export const DEFAULT_MAP_ZOOM = 16;

// ---------------------------------------------------------------------------
// Basemap
// ---------------------------------------------------------------------------

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// ---------------------------------------------------------------------------
// Custom events
// ---------------------------------------------------------------------------

/** Custom event fired by BaseMap after basemap style + globe + paint overrides are settled. */
export const MAP_STYLE_READY_EVENT = "map-style-ready";

/** Custom event fired by useMapLayers after all config-driven layers have been added. */
export const MAP_LAYERS_READY_EVENT = "map-layers-ready";

// ---------------------------------------------------------------------------
// Map Server Endpoints (Scalable Array Config)
// ---------------------------------------------------------------------------

export const MAP_SERVER_ENDPOINTS: MapServerEndpoint[] = [
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

export const DEFAULT_MAP_SERVER_ENDPOINT = MAP_SERVER_ENDPOINTS[0];

// ---------------------------------------------------------------------------
// WMS Defaults (Legacy compatibility)
// ---------------------------------------------------------------------------

export const WMS_BASE_URL = DEFAULT_MAP_SERVER_ENDPOINT.wmsUrl;
export const WMS_VERSION = DEFAULT_MAP_SERVER_ENDPOINT.wmsVersion ?? "1.1.1";
export const WMS_SRS = "EPSG:3857";
export const WMS_LAYER_NAME = "igt:CONTOH_BIDANG_TANAH";

// ---------------------------------------------------------------------------
// WFS Defaults (Legacy compatibility)
// ---------------------------------------------------------------------------

export const WFS_BASE_URL = DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl;
export const WFS_VERSION = DEFAULT_MAP_SERVER_ENDPOINT.wfsVersion ?? "1.0.0";
export const WFS_OUTPUT_FORMAT =
  DEFAULT_MAP_SERVER_ENDPOINT.outputFormat ?? "application/json";
export const WFS_SRS_NAME = DEFAULT_MAP_SERVER_ENDPOINT.srsName ?? "EPSG:4326";
export const WFS_LAYER_NAME = "igt:CONTOH_BIDANG_TANAH";

// ---------------------------------------------------------------------------
// Default Map Layers Array (Scalable Preset Array)
// ---------------------------------------------------------------------------

export const DEFAULT_MAP_LAYERS: MapLayerConfig[] = [
  {
    id: "igt-bidang-tanah-wms-raster",
    type: "wms-raster",
    wmsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wmsUrl,
    layers: WMS_LAYER_NAME,
    visible: true,
  },
  {
    id: "igt-bidang-tanah-wfs-fill",
    type: "wfs-fill",
    wfsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl,
    wfsTypeName: WFS_LAYER_NAME,
    paint: {
      "fill-color": "#f59e0b",
      "fill-opacity": 0.15,
    },
    visible: true,
  },
  {
    id: "igt-bidang-tanah-wfs-line",
    type: "wfs-line",
    wfsUrl: DEFAULT_MAP_SERVER_ENDPOINT.wfsUrl,
    wfsTypeName: WFS_LAYER_NAME,
    paint: {
      "line-color": "#f59e0b",
      "line-width": 1,
      "line-opacity": 0.8,
    },
    visible: true,
  },
];

// ---------------------------------------------------------------------------
// Layer render type map
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

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export const DEFAULT_RASTER_TILE_SIZE = 256;

/** Pixel radius used to detect a click near the first vertex, to close a polygon. */
export const DRAW_CLOSE_HIT_RADIUS_PX = 12;
