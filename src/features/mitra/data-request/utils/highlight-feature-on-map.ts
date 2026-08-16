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

/** Derives bounding box [minLng, minLat, maxLng, maxLat] from geometry. */
export const getGeometryBounds = (
  geom: GeoJSON.Geometry,
): [number, number, number, number] | null => {
  const coords: [number, number][] = [];

  const processCoords = (c: unknown) => {
    if (!Array.isArray(c)) return;
    if (typeof c[0] === "number" && typeof c[1] === "number") {
      let lng = c[0];
      let lat = c[1];
      if (Math.abs(lng) <= 90 && Math.abs(lat) > 90) {
        const temp = lng;
        lng = lat;
        lat = temp;
      }
      if (!isNaN(lng) && !isNaN(lat) && Math.abs(lat) <= 90) {
        coords.push([lng, lat]);
      }
    } else {
      c.forEach(processCoords);
    }
  };

  processCoords((geom as unknown as { coordinates?: unknown }).coordinates);

  if (coords.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  coords.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  });

  return [minLng, minLat, maxLng, maxLat];
};

/** Calculates overall bounding box from a FeatureCollection. */
export const getFeatureCollectionBounds = (
  fc: GeoJSON.FeatureCollection,
): [number, number, number, number] | null => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  fc.features.forEach((feat) => {
    if (!feat.geometry) return;
    const b = getGeometryBounds(feat.geometry);
    if (b) {
      if (b[0] < minLng) minLng = b[0];
      if (b[1] < minLat) minLat = b[1];
      if (b[2] > maxLng) maxLng = b[2];
      if (b[3] > maxLat) maxLat = b[3];
    }
  });

  if (
    minLng !== Infinity &&
    minLat !== Infinity &&
    maxLng !== -Infinity &&
    maxLat !== -Infinity
  ) {
    return [minLng, minLat, maxLng, maxLat];
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
 * Creates or updates a highlight layer with the given GeoJSON geometry, feature, or FeatureCollection,
 * flies or zooms the map camera directly into the feature, and automatically removes the highlight after 5 seconds.
 */
export const highlightFeatureOnMap = (
  map: maplibregl.Map,
  geometryOrFeatureOrCollection:
    | GeoJSON.Geometry
    | GeoJSON.Feature
    | GeoJSON.FeatureCollection,
  options?: {
    zoom?: number;
    timeoutMs?: number;
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(map as any).style || !map.isStyleLoaded()) return;

  const { zoom = 16, timeoutMs = HIGHLIGHT_TIMEOUT_MS } = options ?? {};

  const geojson: GeoJSON.GeoJSON =
    geometryOrFeatureOrCollection.type === "FeatureCollection" ||
    geometryOrFeatureOrCollection.type === "Feature"
      ? (geometryOrFeatureOrCollection as GeoJSON.GeoJSON)
      : {
          type: "Feature",
          properties: {},
          geometry: geometryOrFeatureOrCollection as GeoJSON.Geometry,
        };

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
    existingSource.setData(geojson);
  } else {
    map.addSource(HIGHLIGHT_SOURCE_ID, {
      type: "geojson",
      data: geojson,
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
          "fill-opacity": 0.45,
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
          "line-width": 3.5,
          "line-opacity": 1,
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
          "circle-radius": 9,
          "circle-color": HIGHLIGHT_COLOR,
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#ffffff",
        },
      } as maplibregl.LayerSpecification,
      beforeId,
    );
  }

  // 4. Calculate bounds & fit camera
  let bounds: [number, number, number, number] | null = null;
  if (geojson.type === "FeatureCollection") {
    bounds = getFeatureCollectionBounds(geojson as GeoJSON.FeatureCollection);
  } else if (geojson.type === "Feature") {
    bounds = getGeometryBounds((geojson as GeoJSON.Feature).geometry);
  }

  if (bounds) {
    map.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        padding: 80,
        maxZoom: zoom,
        duration: 1200,
      },
    );
  } else if (
    geojson.type === "Feature" &&
    (geojson as GeoJSON.Feature).geometry
  ) {
    const centroid = getGeometryCentroid(
      (geojson as GeoJSON.Feature).geometry,
    );
    if (centroid) {
      map.flyTo({ center: centroid, zoom, duration: 1200 });
    }
  }

  // 5. Auto cleanup after timeout
  highlightTimer = setTimeout(() => {
    removeFeatureHighlightFromMap(map);
  }, timeoutMs);
};
