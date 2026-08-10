// src/design-system/components/map/hooks/use-map-layers.ts

import {
  MAP_CONFIG,
  MAP_EVENTS_MAP,
} from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import type {
  MapLayerConfig,
  WmsRasterLayerConfig,
} from "@/design-system/components/map/types/map.type";

import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

/** Builds a WMS GetMap raster tile URL template if tileUrl is not provided directly. */
const resolveWmsTileUrl = (layer: WmsRasterLayerConfig): string => {
  if (layer.tileUrl) return layer.tileUrl;

  const baseUrl =
    layer.wmsUrl ?? "https://igtpr.atrbpn.go.id/geoserver/igt/wms";
  const layerName = layer.layers ?? "igt:CONTOH_BIDANG_TANAH";
  const params = new URLSearchParams({
    service: "WMS",
    version: layer.version ?? "1.1.1",
    request: "GetMap",
    layers: layerName,
    format: layer.format ?? "image/png",
    transparent: layer.transparent !== false ? "true" : "false",
    srs: layer.srs ?? "EPSG:3857",
    width: String(layer.tileSize ?? MAP_CONFIG.raster.tileSize),
    height: String(layer.tileSize ?? MAP_CONFIG.raster.tileSize),
  });
  return `${baseUrl}?${params.toString()}&bbox={bbox-epsg-3857}`;
};

/**
 * Returns the layer ID to insert custom data layers (WMS/WFS) before:
 * 1. The first draw layer (if draw layer exists), so WMS/WFS layers render below draw/AOI geometries.
 * 2. The first symbol/label layer that appears AFTER basemap buildings (both 2D "building" and 3D "building-3d"),
 *    so WMS/WFS layers strictly render ABOVE all basemap layers (landuse, water, roads, 2D/3D buildings).
 */
const getCustomLayerBeforeId = (map: maplibregl.Map): string | undefined => {
  if (map.getLayer(DRAW_FILL_LAYER_ID)) {
    return DRAW_FILL_LAYER_ID;
  }
  const styleLayers = map.getStyle()?.layers;
  if (styleLayers) {
    const building3dIdx = styleLayers.findIndex((l) => l.id === "building-3d");
    const buildingIdx = styleLayers.findIndex((l) => l.id === "building");
    const maxBuildingIdx = Math.max(building3dIdx, buildingIdx);

    if (maxBuildingIdx !== -1) {
      for (let i = maxBuildingIdx + 1; i < styleLayers.length; i++) {
        if (styleLayers[i].type === "symbol") {
          return styleLayers[i].id;
        }
      }
    }

    const firstSymbol = styleLayers.find((l) => l.type === "symbol");
    if (firstSymbol) return firstSymbol.id;
  }
  return undefined;
};

/** Resolves the layout visibility value from the layer config. */
const resolveVisibility = (layer: MapLayerConfig): "visible" | "none" =>
  layer.visible === false ? "none" : "visible";

/** Adds/removes a list of config-driven layers (WMS raster, WFS, raster tile, vector tile) on the given map instance. */
export const useMapLayers = (
  map: maplibregl.Map | null,
  layers: MapLayerConfig[],
) => {
  // Use a ref so the map-style-ready handler always reads the latest layer configs
  // without needing to re-register the event listener every time layers change.
  const layersRef = useRef(layers);
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  useEffect(() => {
    if (!map) return;

    const controller = new AbortController();


    const safeAddSource = (
      id: string,
      sourceSpec: maplibregl.SourceSpecification,
    ) => {
      if (map.getSource(id)) return;
      try {
        map.addSource(id, sourceSpec);
      } catch (err) {
        console.error(`Failed to add source "${id}"`, err);
      }
    };

    const safeAddLayer = (
      spec: maplibregl.LayerSpecification,
      beforeId?: string,
    ) => {
      if (map.getLayer(spec.id)) return;
      const targetBeforeId =
        beforeId && map.getLayer(beforeId) ? beforeId : undefined;
      try {
        map.addLayer(spec, targetBeforeId);
      } catch (err) {
        console.warn(
          `Fallback addLayer for "${spec.id}" without beforeId`,
          err,
        );
        try {
          map.addLayer(spec);
        } catch (e) {
          console.error(`Failed to add layer "${spec.id}"`, e);
        }
      }
    };

    const addLayer = async (layer: MapLayerConfig) => {
      const beforeId = getCustomLayerBeforeId(map);
      const visibility = resolveVisibility(layer);

      switch (layer.type) {
        case "wms-raster": {
          const tileUrl = resolveWmsTileUrl(layer);
          safeAddSource(layer.id, {
            type: "raster",
            tiles: [tileUrl],
            tileSize: layer.tileSize ?? MAP_CONFIG.raster.tileSize,
          });
          safeAddLayer(
            {
              id: layer.id,
              type: "raster",
              source: layer.id,
              layout: { visibility },
            },
            beforeId,
          );
          break;
        }

        case "wfs-fill":
        case "wfs-line":
        case "wfs-circle":
        case "wfs-symbol": {
          // Visual WFS rendering is disabled. Only WMS is rendered visually, WFS is query-only.
          break;
        }

        case "raster-tile": {
          safeAddSource(layer.id, {
            type: "raster",
            tiles: [layer.tileUrl],
            tileSize: layer.tileSize ?? MAP_CONFIG.raster.tileSize,
          });
          safeAddLayer(
            {
              id: layer.id,
              type: "raster",
              source: layer.id,
              layout: { visibility },
            },
            beforeId,
          );
          break;
        }

        case "vector-tile": {
          safeAddSource(layer.id, { type: "vector", tiles: [layer.tileUrl] });
          safeAddLayer(
            {
              id: layer.id,
              type: "fill",
              source: layer.id,
              "source-layer": layer.sourceLayer,
              paint: layer.paint,
              layout: { ...layer.layout, visibility },
            } as maplibregl.LayerSpecification,
            beforeId,
          );
          break;
        }
      }
    };

    /** Remove all previously-added config layers (safe to call when none exist). */
    const removeLayers = (configs: MapLayerConfig[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;

      configs.forEach((layer) => {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
        if (map.getSource(layer.id)) map.removeSource(layer.id);
      });
    };

    let setupSeq = 0;

    /**
     * Adds all config layers from scratch in absolute order:
     *   basemap (already present) → wms-raster → wfs-* → draw layers (added by useMapDraw)
     *
     * Removes own data layers first, then re-adds sequentially, then fires
     * MAP_LAYERS_READY_EVENT so useMapDraw knows to (re)add draw layers on top.
     *
     * This function is passed directly to both map.on and map.off so the
     * listener reference is stable and map.off() correctly removes it.
     */
    const setupLayers = async () => {
      const seq = ++setupSeq;

      // Remove own data layers first (idempotent — safe if already wiped by style.load)
      removeLayers(layersRef.current);

      const configs = layersRef.current;

      // Add layers in array order (bottom to top): wms-raster first, then wfs-*.
      // The consumer controls ordering via the config array.
      for (const layer of configs) {
        if (seq !== setupSeq || controller.signal.aborted) return;

        try {
          await addLayer(layer);
        } catch (error: unknown) {
          console.error(`Failed to add layer "${layer.id}"`, error);
        }
      }

      // Signal useMapDraw to (re)add draw layers on top
      if (seq === setupSeq && !controller.signal.aborted) {
        map.fire(MAP_EVENTS_MAP.layersReady);
      }
    };

    // Listen for MAP_EVENTS_MAP.styleReady (fired by basemap after applyGlobe settles)
    // Pass setupLayers directly — same reference used in map.off for correct cleanup
    map.on(MAP_EVENTS_MAP.styleReady as string, setupLayers);

    // Also run immediately for initial mount
    // (basemap may have already fired MAP_EVENTS_MAP.styleReady before useMapLayers mounted)
    void setupLayers();

    return () => {
      controller.abort();
      // Correct cleanup: same reference as map.on — listener is fully removed
      map.off(MAP_EVENTS_MAP.styleReady as string, setupLayers);
      removeLayers(layersRef.current);
    };
  }, [map]);

  // Respond to layer config changes (e.g. visibility toggle) without full teardown/rebuild.
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    layers.forEach((layer) => {
      if (!map.getLayer(layer.id)) return;

      map.setLayoutProperty(layer.id, "visibility", resolveVisibility(layer));
    });
  }, [map, layers]);
};
