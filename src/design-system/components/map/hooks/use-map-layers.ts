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
import { useCallback, useEffect, useRef } from "react";

/** Builds a WMS GetMap raster tile URL template if tileUrl is not provided directly. */
const resolveWmsTileUrl = (layer: WmsRasterLayerConfig): string => {
  if (layer.tileUrl) return layer.tileUrl;

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL &&
    !import.meta.env.VITE_API_BASE_URL.endsWith("/")
      ? `${import.meta.env.VITE_API_BASE_URL}/api/proxy/wms`
      : `${import.meta.env.VITE_API_BASE_URL || ""}/api/proxy/wms`;

  const layerName = layer.layers ?? layer.id ?? "";
  const queryParams: Record<string, string> = {
    layerId: layer.id || layerName,
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

/** Resolves the paint opacity value from the layer config. */
const resolveOpacity = (layer: MapLayerConfig): number => layer.opacity ?? 1;

/** Adds/removes a list of config-driven layers (WMS raster, WFS, raster tile, vector tile) on the given map instance. */
export const useMapLayers = (
  map: maplibregl.Map | null,
  layers: MapLayerConfig[],
  cqlFilter?: string,
) => {
  const layersRef = useRef(layers);
  const cqlFilterRef = useRef(cqlFilter);
  const registeredLayerIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    layersRef.current = layers;
    cqlFilterRef.current = cqlFilter;
  }, [layers, cqlFilter]);

  const safeAddSource = useCallback(
    (id: string, sourceSpec: maplibregl.SourceSpecification) => {
      if (!map || map.getSource(id)) return;
      try {
        map.addSource(id, sourceSpec);
      } catch (err) {
        console.error(`Failed to add source "${id}"`, err);
      }
    },
    [map],
  );

  const safeAddLayer = useCallback(
    (spec: maplibregl.LayerSpecification, beforeId?: string) => {
      if (!map || map.getLayer(spec.id)) return;
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
    },
    [map],
  );

  const addLayer = useCallback(
    async (layer: MapLayerConfig) => {
      if (!map) return;
      const beforeId = getCustomLayerBeforeId(map);
      const visibility = resolveVisibility(layer);
      const opacity = resolveOpacity(layer);

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
              paint: { "raster-opacity": opacity, ...(layer.paint ?? {}) },
            },
            beforeId,
          );
          break;
        }

        case "wfs-fill":
        case "wfs-line":
        case "wfs-circle":
        case "wfs-symbol": {
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
              paint: { "raster-opacity": opacity, ...(layer.paint ?? {}) },
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
              paint: { "fill-opacity": opacity, ...(layer.paint ?? {}) },
              layout: { ...layer.layout, visibility },
            } as maplibregl.LayerSpecification,
            beforeId,
          );
          break;
        }
      }
    },
    [map, safeAddSource, safeAddLayer],
  );

  const removeLayers = useCallback(
    (configs: MapLayerConfig[]) => {
      if (!map) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;

      configs.forEach((layer) => {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
        if (map.getSource(layer.id)) map.removeSource(layer.id);
      });
      registeredLayerIdsRef.current.clear();
    },
    [map],
  );

  const setupLayers = useCallback(async () => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style) return;

    const configs = layersRef.current;
    for (const layer of configs) {
      try {
        registeredLayerIdsRef.current.add(layer.id);
        if (!map.getSource(layer.id) || !map.getLayer(layer.id)) {
          await addLayer(layer);
        }
      } catch (error: unknown) {
        console.error(`Failed to add layer "${layer.id}"`, error);
      }
    }
    map.fire(MAP_EVENTS_MAP.layersReady);
  }, [map, addLayer]);

  // Setup on map-style-ready
  useEffect(() => {
    if (!map) return;

    const handleStyleReady = () => {
      removeLayers(layersRef.current);
      void setupLayers();
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, handleStyleReady);
    void setupLayers();

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, handleStyleReady);
    };
  }, [map, setupLayers, removeLayers]);

  // Respond to dynamic changes in layers array, visibility, and opacity
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style) return;

    const currentLayerIds = new Set(layers.map((l) => l.id));

    // Handle any previously registered layers that are no longer in the layers array
    registeredLayerIdsRef.current.forEach((prevId) => {
      if (!currentLayerIds.has(prevId)) {
        if (map.getLayer(prevId)) {
          map.setLayoutProperty(prevId, "visibility", "none");
        }
      }
    });

    layers.forEach(async (layer) => {
      registeredLayerIdsRef.current.add(layer.id);

      if (!map.getSource(layer.id) || !map.getLayer(layer.id)) {
        await addLayer(layer);
        return;
      }

      if (layer.type === "wms-raster") {
        const newTileUrl = resolveWmsTileUrl(layer);
        const source = map.getSource(
          layer.id,
        ) as maplibregl.RasterTileSource | undefined;

        if (source && typeof source.setTiles === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentTiles = (source as any).tiles;
          if (!currentTiles || currentTiles[0] !== newTileUrl) {
            source.setTiles([newTileUrl]);
          }
        }
      }

      if (map.getLayer(layer.id)) {
        const targetVisibility = resolveVisibility(layer);
        const currentVisibility = map.getLayoutProperty(
          layer.id,
          "visibility",
        );
        if (currentVisibility !== targetVisibility) {
          map.setLayoutProperty(layer.id, "visibility", targetVisibility);
        }

        const targetOpacity = resolveOpacity(layer);
        const opacityPropName =
          layer.type === "wms-raster" || layer.type === "raster-tile"
            ? "raster-opacity"
            : layer.type === "vector-tile"
              ? "fill-opacity"
              : "raster-opacity";

        const currentOpacity = map.getPaintProperty(layer.id, opacityPropName);
        if (currentOpacity !== targetOpacity) {
          map.setPaintProperty(layer.id, opacityPropName, targetOpacity);
        }
      }
    });
  }, [map, layers, cqlFilter, addLayer]);
};
