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

import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";

/** Builds a WMS GetMap raster tile URL template if tileUrl is not provided directly. */
const resolveWmsTileUrl = (
  layer: WmsRasterLayerConfig,
  cqlFilter?: string,
): string => {
  if (layer.tileUrl) return layer.tileUrl;

  if (!layer.wmsUrl) return "";
  const baseUrl = layer.wmsUrl;
  const layerName = layer.layers ?? "";
  const queryParams: Record<string, string> = {
    service: "WMS",
    version: layer.version ?? "1.1.1",
    request: "GetMap",
    layers: layerName,
    styles: layer.styles ?? "",
    format: layer.format ?? "image/png",
    transparent: "true",
    srs: layer.srs ?? "EPSG:3857",
    width: String(layer.tileSize ?? MAP_CONFIG.raster.tileSize),
    height: String(layer.tileSize ?? MAP_CONFIG.raster.tileSize),
  };

  if (cqlFilter) {
    queryParams.CQL_FILTER = cqlFilter;
  }

  const params = new URLSearchParams(queryParams);
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
  const cqlFilter = useIgtLayerStore((state) => state.cqlFilter);

  // Use a ref so the map-style-ready handler always reads the latest layer configs
  // without needing to re-register the event listener every time layers change.
  const layersRef = useRef(layers);
  const cqlFilterRef = useRef(cqlFilter);

  useEffect(() => {
    layersRef.current = layers;
    cqlFilterRef.current = cqlFilter;
  }, [layers, cqlFilter]);

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
          const tileUrl = resolveWmsTileUrl(layer, cqlFilterRef.current);
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

    const setupLayers = async () => {
      const seq = ++setupSeq;

      // Remove own data layers first
      removeLayers(layersRef.current);

      const configs = layersRef.current;

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

    map.on(MAP_EVENTS_MAP.styleReady as string, setupLayers);
    void setupLayers();

    return () => {
      controller.abort();
      map.off(MAP_EVENTS_MAP.styleReady as string, setupLayers);
      removeLayers(layersRef.current);
    };
  }, [map]);

  // Respond to layer config & cqlFilter changes dynamically
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    layers.forEach((layer) => {
      if (layer.type === "wms-raster") {
        const newTileUrl = resolveWmsTileUrl(layer, cqlFilter);
        const source = map.getSource(
          layer.id,
        ) as maplibregl.RasterTileSource | undefined;

        if (source && typeof source.setTiles === "function") {
          source.setTiles([newTileUrl]);
        }
      }

      if (map.getLayer(layer.id)) {
        map.setLayoutProperty(layer.id, "visibility", resolveVisibility(layer));
      }
    });
  }, [map, layers, cqlFilter]);
};
