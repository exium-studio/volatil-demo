// src/features/map/hooks/use-map-layers.ts

import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import {
  DEFAULT_RASTER_TILE_SIZE,
  WFS_LAYER_RENDER_TYPE_MAP,
} from "@/design-system/components/map/constants/map.constant";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";

/** Adds/removes a list of config-driven layers (WFS, raster tile, vector tile) on the given map instance. */
export const useMapLayers = (
  map: maplibregl.Map | null,
  layers: MapLayerConfig[],
) => {
  useEffect(() => {
    if (!map) return;

    const controller = new AbortController();

    const addLayer = async (layer: MapLayerConfig) => {
      switch (layer.type) {
        case "wfs-fill":
        case "wfs-line":
        case "wfs-circle":
        case "wfs-symbol": {
          const data = await fetchWfs({
            typeName: layer.wfsTypeName,
            signal: controller.signal,
          });

          if (controller.signal.aborted) return;

          map.addSource(layer.id, { type: "geojson", data });
          map.addLayer({
            id: layer.id,
            type: WFS_LAYER_RENDER_TYPE_MAP[layer.type],
            source: layer.id,
            paint: layer.paint,
            layout: layer.layout,
          } as maplibregl.LayerSpecification);
          break;
        }

        case "raster-tile": {
          map.addSource(layer.id, {
            type: "raster",
            tiles: [layer.tileUrl],
            tileSize: layer.tileSize ?? DEFAULT_RASTER_TILE_SIZE,
          });
          map.addLayer({ id: layer.id, type: "raster", source: layer.id });
          break;
        }

        case "vector-tile": {
          map.addSource(layer.id, { type: "vector", tiles: [layer.tileUrl] });
          map.addLayer({
            id: layer.id,
            type: "fill",
            source: layer.id,
            "source-layer": layer.sourceLayer,
            paint: layer.paint,
          } as maplibregl.LayerSpecification);
          break;
        }
      }
    };

    const setupLayers = () => {
      layers.forEach((layer) => {
        if (!map.getLayer(layer.id) && !map.getSource(layer.id)) {
          // TODO: call toast.error(`Failed to load layer "${layer.id}"`) when a layer fails (e.g. WFS request error)
          void addLayer(layer).catch((error: unknown) => {
            console.error(`Failed to add layer "${layer.id}"`, error);
          });
        }
      });
    };

    if (map.isStyleLoaded()) {
      setupLayers();
    }
    map.on("style.load", setupLayers);

    return () => {
      controller.abort();
      map.off("style.load", setupLayers);

      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
        if (map.getSource(layer.id)) map.removeSource(layer.id);
      });
    };
  }, [map, layers]);
};
