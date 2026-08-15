// src/features/mitra/data-request/utils/highlight-feature-on-map.ts

import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";

export const HIGHLIGHT_SOURCE_ID = "map-feature-highlight-source";
export const HIGHLIGHT_FILL_LAYER_ID = "map-feature-highlight-fill";
export const HIGHLIGHT_LINE_LAYER_ID = "map-feature-highlight-line";
export const HIGHLIGHT_POINT_LAYER_ID = "map-feature-highlight-point";

const HIGHLIGHT_COLOR = "#00e5ff";
const HIGHLIGHT_TIMEOUT_MS = 5000;

let highlightTimer: ReturnType<typeof setTimeout> | null = null;

/** Derives [lng, lat] centroid from a GeoJSON geometry, or null if unsupported. */
export const getGeometryCentroid = (
  geom: GeoJSON.Geometry,
): [number, number] | null => {
  if (geom.type === "Point") {
    const [lng, lat] = geom.coordinates as [number, number];
    return [lng, lat];
  }

  if (geom.type === "Polygon" && geom.coordinates[0]?.length > 0) {
    const ring = geom.coordinates[0];
    const lng =
      ring.reduce((acc: number, c: number[]) => acc + c[0], 0) / ring.length;
    const lat =
      ring.reduce((acc: number, c: number[]) => acc + c[1], 0) / ring.length;
    return [lng, lat];
  }

  if (geom.type === "MultiPolygon" && geom.coordinates[0]?.[0]?.length > 0) {
    const ring = geom.coordinates[0][0];
    const lng =
      ring.reduce((acc: number, c: number[]) => acc + c[0], 0) / ring.length;
    const lat =
      ring.reduce((acc: number, c: number[]) => acc + c[1], 0) / ring.length;
    return [lng, lat];
  }

  return null;
};

/** Removes the highlight layer and source from the map. */
export const removeFeatureHighlightFromMap = (map: maplibregl.Map) => {
  if (highlightTimer) {
    clearTimeout(highlightTimer);
    highlightTimer = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(map as any).style) return;

  if (map.getLayer(HIGHLIGHT_POINT_LAYER_ID)) {
    map.removeLayer(HIGHLIGHT_POINT_LAYER_ID);
  }
  if (map.getLayer(HIGHLIGHT_LINE_LAYER_ID)) {
    map.removeLayer(HIGHLIGHT_LINE_LAYER_ID);
  }
  if (map.getLayer(HIGHLIGHT_FILL_LAYER_ID)) {
    map.removeLayer(HIGHLIGHT_FILL_LAYER_ID);
  }
  if (map.getSource(HIGHLIGHT_SOURCE_ID)) {
    map.removeSource(HIGHLIGHT_SOURCE_ID);
  }
};

/**
 * Creates or updates a highlight layer with the given GeoJSON feature/geometry,
 * flies the map camera to its centroid, and automatically removes the highlight after 5 seconds.
 */
export const highlightFeatureOnMap = (
  map: maplibregl.Map,
  geometryOrFeature: GeoJSON.Geometry | GeoJSON.Feature,
  options?: {
    zoom?: number;
    timeoutMs?: number;
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(map as any).style || !map.isStyleLoaded()) return;

  const { zoom = 16, timeoutMs = HIGHLIGHT_TIMEOUT_MS } = options ?? {};

  const feature: GeoJSON.Feature =
    geometryOrFeature.type === "Feature"
      ? (geometryOrFeature as GeoJSON.Feature)
      : {
          type: "Feature",
          properties: {},
          geometry: geometryOrFeature as GeoJSON.Geometry,
        };

  if (!feature.geometry) return;

  // 1. Clear previous timer
  if (highlightTimer) {
    clearTimeout(highlightTimer);
    highlightTimer = null;
  }

  // 2. Add or update source
  const existingSource = map.getSource(HIGHLIGHT_SOURCE_ID) as
    | maplibregl.GeoJSONSource
    | undefined;

  if (existingSource) {
    existingSource.setData(feature);
  } else {
    map.addSource(HIGHLIGHT_SOURCE_ID, {
      type: "geojson",
      data: feature,
    });
  }

  // 3. Ensure layers are created before draw layer if present
  const beforeId = map.getLayer(DRAW_FILL_LAYER_ID)
    ? DRAW_FILL_LAYER_ID
    : undefined;

  if (!map.getLayer(HIGHLIGHT_FILL_LAYER_ID)) {
    map.addLayer(
      {
        id: HIGHLIGHT_FILL_LAYER_ID,
        type: "fill",
        source: HIGHLIGHT_SOURCE_ID,
        paint: {
          "fill-color": HIGHLIGHT_COLOR,
          "fill-opacity": 0.4,
        },
      } as maplibregl.LayerSpecification,
      beforeId,
    );
  }

  if (!map.getLayer(HIGHLIGHT_LINE_LAYER_ID)) {
    map.addLayer(
      {
        id: HIGHLIGHT_LINE_LAYER_ID,
        type: "line",
        source: HIGHLIGHT_SOURCE_ID,
        paint: {
          "line-color": HIGHLIGHT_COLOR,
          "line-width": 3,
          "line-opacity": 0.9,
        },
      } as maplibregl.LayerSpecification,
      beforeId,
    );
  }

  if (!map.getLayer(HIGHLIGHT_POINT_LAYER_ID)) {
    map.addLayer(
      {
        id: HIGHLIGHT_POINT_LAYER_ID,
        type: "circle",
        source: HIGHLIGHT_SOURCE_ID,
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": 8,
          "circle-color": HIGHLIGHT_COLOR,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      } as maplibregl.LayerSpecification,
      beforeId,
    );
  }

  // 4. Fly camera to centroid
  const centroid = getGeometryCentroid(feature.geometry);
  if (centroid) {
    map.flyTo({ center: centroid, zoom });
  }

  // 5. Auto cleanup after timeout
  highlightTimer = setTimeout(() => {
    removeFeatureHighlightFromMap(map);
  }, timeoutMs);
};
