// src/features/clip/hooks/use-wms-layer.ts

import {
  WMS_BASE_URL,
  WMS_LAYER_NAME,
  WMS_SRS,
  WMS_VERSION,
} from "@/design-system/components/map/constants/map.config";
import { useEffect } from "react";
import type maplibregl from "maplibre-gl";

const WMS_SOURCE_ID = "clip-wms-source";
const WMS_LAYER_ID = "clip-wms-layer";

/** Builds the GetMap tile URL template for MapLibre raster tiles. */
function buildWmsTileUrl(): string {
  const params = new URLSearchParams({
    service: "WMS",
    version: WMS_VERSION,
    request: "GetMap",
    layers: WMS_LAYER_NAME,
    styles: "",
    format: "image/png",
    transparent: "true",
    srs: WMS_SRS,
    width: "256",
    height: "256",
    bbox: "{bbox-epsg-3857}",
  });
  return `${WMS_BASE_URL}?${params.toString()}`;
}

/**
 * Adds a GeoServer WMS raster layer to the map and responds to `visible` toggle.
 * The layer is re-added automatically after basemap style changes.
 */
export function useWmsLayer(
  map: maplibregl.Map | null,
  visible: boolean,
): void {
  useEffect(() => {
    if (!map) return;

    const tileUrl = buildWmsTileUrl();

    const addLayers = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style || !map.isStyleLoaded()) return;

      if (!map.getSource(WMS_SOURCE_ID)) {
        map.addSource(WMS_SOURCE_ID, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
        });
      }

      if (!map.getLayer(WMS_LAYER_ID)) {
        map.addLayer({
          id: WMS_LAYER_ID,
          type: "raster",
          source: WMS_SOURCE_ID,
        });
      }
    };

    if (map.isStyleLoaded()) {
      addLayers();
    }
    map.on("style.load", addLayers);

    return () => {
      map.off("style.load", addLayers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;
      if (map.getLayer(WMS_LAYER_ID)) map.removeLayer(WMS_LAYER_ID);
      if (map.getSource(WMS_SOURCE_ID)) map.removeSource(WMS_SOURCE_ID);
    };
  }, [map]);

  // Respond to visibility toggle separately to avoid re-adding layers on every toggle.
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;
    if (!map.getLayer(WMS_LAYER_ID)) return;

    map.setLayoutProperty(
      WMS_LAYER_ID,
      "visibility",
      visible ? "visible" : "none",
    );
  }, [map, visible]);
}
