// src/design-system/components/map/hooks/use-map-layers.ts

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import {
  DEFAULT_RASTER_TILE_SIZE,
  MAP_LAYERS_READY_EVENT,
  MAP_STYLE_READY_EVENT,
  WFS_LAYER_RENDER_TYPE_MAP,
} from "@/design-system/components/map/constants/map.config";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";

/**
 * Returns the layer ID to insert custom layers before:
 * 1. The first draw layer (if drawing active), so custom layers are below draw geometries.
 * 2. The first symbol/label layer in the basemap style, so custom layers render above basemap landuse/buildings.
 */
const getCustomLayerBeforeId = (map: maplibregl.Map): string | undefined => {
  if (map.getLayer(DRAW_FILL_LAYER_ID)) {
    return DRAW_FILL_LAYER_ID;
  }
  const styleLayers = map.getStyle()?.layers;
  if (styleLayers) {
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

    const wfsCache = new Map<string, GeoJSON.FeatureCollection>();

    const getWfsData = async (typeName: string) => {
      const cached = wfsCache.get(typeName);
      if (cached) return cached;
      const data = await fetchWfs({
        typeName,
        signal: controller.signal,
      });
      wfsCache.set(typeName, data);
      return data;
    };

    const addLayer = async (layer: MapLayerConfig) => {
      // Skip if already added (idempotent guard).
      if (map.getSource(layer.id)) return;

      const beforeId = getCustomLayerBeforeId(map);
      const visibility = resolveVisibility(layer);

      switch (layer.type) {
        case "wms-raster": {
          map.addSource(layer.id, {
            type: "raster",
            tiles: [layer.tileUrl],
            tileSize: layer.tileSize ?? DEFAULT_RASTER_TILE_SIZE,
          });
          map.addLayer(
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
          const data = await getWfsData(layer.wfsTypeName);

          if (controller.signal.aborted) return;

          map.addSource(layer.id, { type: "geojson", data });
          map.addLayer(
            {
              id: layer.id,
              type: WFS_LAYER_RENDER_TYPE_MAP[layer.type],
              source: layer.id,
              paint: layer.paint,
              layout: { ...layer.layout, visibility },
            } as maplibregl.LayerSpecification,
            beforeId,
          );
          break;
        }

        case "raster-tile": {
          map.addSource(layer.id, {
            type: "raster",
            tiles: [layer.tileUrl],
            tileSize: layer.tileSize ?? DEFAULT_RASTER_TILE_SIZE,
          });
          map.addLayer(
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
          map.addSource(layer.id, { type: "vector", tiles: [layer.tileUrl] });
          map.addLayer(
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

    /**
     * Adds all config layers from scratch, then fires MAP_LAYERS_READY_EVENT
     * so useMapDraw can add draw layers on top.
     */
    const setupLayers = async () => {
      const configs = layersRef.current;

      // Force-clean existing layers first — style.load wipes sources anyway,
      // but explicit cleanup avoids leftover state from partial adds.
      removeLayers(configs);

      // Add layers in array order (bottom to top): wms-raster should be first,
      // then wfs-*, etc. The consumer controls the ordering via the config array.
      const promises = configs.map((layer) =>
        // TODO: call toast.error(`Failed to load layer "${layer.id}"`) when a layer fails (e.g. WFS request error)
        addLayer(layer).catch((error: unknown) => {
          console.error(`Failed to add layer "${layer.id}"`, error);
        }),
      );

      await Promise.all(promises);

      if (!controller.signal.aborted) {
        map.fire(MAP_LAYERS_READY_EVENT);
      }
    };

    map.on(MAP_STYLE_READY_EVENT as string, setupLayers);

    // If the map is already loaded and style is ready, set up immediately.
    if (map.isStyleLoaded()) {
      void setupLayers();
    }

    return () => {
      controller.abort();
      map.off(MAP_STYLE_READY_EVENT as string, setupLayers);
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
