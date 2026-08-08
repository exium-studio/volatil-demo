// src/design-system/components/map/constants/map.config.ts

import type { LayerSpecification } from "maplibre-gl";
import type { WfsLayerConfig } from "@/design-system/components/map/types/map.type";

/** Monumen Nasional (Monas), Jakarta — default map center and zoom level on first load. */
export const DEFAULT_MAP_CENTER: [number, number] = [106.8272, -6.1754];
export const DEFAULT_MAP_ZOOM = 16;

export const WFS_BASE_URL =
  "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows";
/**
 * WFS 1.0.0 is used instead of 2.0.0 because this GeoServer instance does not
 * return features when CQL_FILTER is applied under version 2.0.0 (always returns 0).
 * Under 1.0.0, spatial CQL filters (INTERSECTS) work correctly.
 */
export const WFS_VERSION = "1.0.0";
export const WFS_OUTPUT_FORMAT = "application/json";
export const WFS_SRS_NAME = "EPSG:4326";

export const WMS_BASE_URL =
  "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms";
export const WMS_VERSION = "1.1.1";
export const WMS_SRS = "EPSG:4326";
export const WMS_LAYER_NAME = "testing_workspace:TEST_BIDANG_TANAH";
export const WFS_LAYER_NAME = "testing_workspace:TEST_BIDANG_TANAH";

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

export const DEFAULT_RASTER_TILE_SIZE = 256;

/** Pixel radius used to detect a click near the first vertex, to close a polygon. */
export const DRAW_CLOSE_HIT_RADIUS_PX = 12;

/** Custom event fired by BaseMap after basemap style + globe + paint overrides are settled. */
export const MAP_STYLE_READY_EVENT = "map-style-ready";

/** Custom event fired by useMapLayers after all config-driven layers have been added. */
export const MAP_LAYERS_READY_EVENT = "map-layers-ready";

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
