// src/features/clip/hooks/use-clip-result-layer.ts

import { useClipStore } from "@/features/clip/stores/use-clip-store";
import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import type GeoJSON from "geojson";

const CLIP_RESULT_SOURCE_ID = "clip-result-source";
const CLIP_RESULT_FILL_LAYER_ID = "clip-result-fill";
const CLIP_RESULT_LINE_LAYER_ID = "clip-result-line";
const CLIP_BOUNDARY_SOURCE_ID = "clip-boundary-source";
const CLIP_BOUNDARY_LINE_LAYER_ID = "clip-boundary-line";

const EMPTY_FC: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

/**
 * Syncs clipped features and the clipping polygon boundary
 * to MapLibre GeoJSON sources, creating layers when needed.
 * Rebuilds everything after a basemap style swap.
 */
export function useClipResultLayer(map: maplibregl.Map | null): void {
  const clippedFeatures = useClipStore((s) => s.clippedFeatures);
  const clippingPolygon = useClipStore((s) => s.clippingPolygon);

  // Set up sources and layers, and subscribe to style reloads.
  useEffect(() => {
    if (!map) return;

    const ensureLayers = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style || !map.isStyleLoaded()) return;

      // Clipped result source
      if (!map.getSource(CLIP_RESULT_SOURCE_ID)) {
        map.addSource(CLIP_RESULT_SOURCE_ID, {
          type: "geojson",
          data: EMPTY_FC,
        });
      }

      // Clipped fill layer
      if (!map.getLayer(CLIP_RESULT_FILL_LAYER_ID)) {
        map.addLayer({
          id: CLIP_RESULT_FILL_LAYER_ID,
          type: "fill",
          source: CLIP_RESULT_SOURCE_ID,
          paint: {
            "fill-color": "#f6a623",
            "fill-opacity": 0.5,
          },
        } as maplibregl.LayerSpecification);
      }

      // Clipped outline layer
      if (!map.getLayer(CLIP_RESULT_LINE_LAYER_ID)) {
        map.addLayer({
          id: CLIP_RESULT_LINE_LAYER_ID,
          type: "line",
          source: CLIP_RESULT_SOURCE_ID,
          paint: {
            "line-color": "#d97706",
            "line-width": 1.5,
          },
        } as maplibregl.LayerSpecification);
      }

      // Clipping polygon boundary source
      if (!map.getSource(CLIP_BOUNDARY_SOURCE_ID)) {
        map.addSource(CLIP_BOUNDARY_SOURCE_ID, {
          type: "geojson",
          data: EMPTY_FC,
        });
      }

      // Clipping polygon boundary line
      if (!map.getLayer(CLIP_BOUNDARY_LINE_LAYER_ID)) {
        map.addLayer({
          id: CLIP_BOUNDARY_LINE_LAYER_ID,
          type: "line",
          source: CLIP_BOUNDARY_SOURCE_ID,
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
            "line-dasharray": [4, 2],
          },
        } as maplibregl.LayerSpecification);
      }
    };

    if (map.isStyleLoaded()) {
      ensureLayers();
    }
    map.on("style.load", ensureLayers);

    return () => {
      map.off("style.load", ensureLayers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;
      [
        CLIP_RESULT_LINE_LAYER_ID,
        CLIP_RESULT_FILL_LAYER_ID,
        CLIP_BOUNDARY_LINE_LAYER_ID,
      ].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      [CLIP_RESULT_SOURCE_ID, CLIP_BOUNDARY_SOURCE_ID].forEach((id) => {
        if (map.getSource(id)) map.removeSource(id);
      });
    };
  }, [map]);

  // Sync clipped features into the result source.
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    const source = map.getSource(
      CLIP_RESULT_SOURCE_ID,
    ) as maplibregl.GeoJSONSource | undefined;
    source?.setData(clippedFeatures ?? EMPTY_FC);
  }, [map, clippedFeatures]);

  // Sync clipping polygon boundary into the boundary source.
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    const source = map.getSource(
      CLIP_BOUNDARY_SOURCE_ID,
    ) as maplibregl.GeoJSONSource | undefined;
    const data: GeoJSON.FeatureCollection = clippingPolygon
      ? { type: "FeatureCollection", features: [clippingPolygon] }
      : EMPTY_FC;
    source?.setData(data);
  }, [map, clippingPolygon]);
}
