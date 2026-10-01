// src/design-system/components/map/utils/geometry.ts

import type { PixelPoint } from "@/design-system/components/map/types/map.utils.type";
import type { DrawPoint } from "@/design-system/components/map/types/map.type";
import type GeoJSON from "geojson";

/** Determines whether a click position is close enough (in screen px) to the first vertex to close the polygon. */
export const isNearFirstPoint = (
  clickPx: PixelPoint,
  firstPointPx: PixelPoint,
  radiusPx: number,
): boolean => {
  const dx = clickPx.x - firstPointPx.x;
  const dy = clickPx.y - firstPointPx.y;
  return Math.sqrt(dx * dx + dy * dy) <= radiusPx;
};

/** Closes a polygon ring by appending the first point at the end, if not already closed. */
export const closePolygonRing = (points: DrawPoint[]): DrawPoint[] => {
  if (points.length < 3) return points;

  const first = points[0];
  const last = points[points.length - 1];
  const isAlreadyClosed = first.lng === last.lng && first.lat === last.lat;

  return isAlreadyClosed ? points : [...points, first];
};

/** Converts accumulated draw points into a GeoJSON Polygon feature. */
export const toPolygonFeature = (
  points: DrawPoint[],
): GeoJSON.Feature<GeoJSON.Polygon> => {
  const ring = closePolygonRing(points);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [ring.map((p) => [p.lng, p.lat])],
    },
  };
};

/**
 * Normalizes input geometry into a strictly 2D GeoJSON Polygon or MultiPolygon Geometry.
 * Extracts geometry from Feature, strips any extra Z/elevation values, and trims coordinate decimals.
 */
export const to2DGeometry = (
  polygon?:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | GeoJSON.Feature
    | GeoJSON.Geometry
    | null,
): GeoJSON.Polygon | GeoJSON.MultiPolygon | null => {
  if (!polygon) return null;

  const rawGeometry: GeoJSON.Geometry | undefined =
    "geometry" in polygon && polygon.geometry
      ? (polygon.geometry as GeoJSON.Geometry)
      : "type" in polygon &&
          (polygon.type === "Polygon" || polygon.type === "MultiPolygon")
        ? (polygon as GeoJSON.Polygon | GeoJSON.MultiPolygon)
        : undefined;

  if (!rawGeometry) return null;

  if (rawGeometry.type === "Polygon") {
    const coordinates = (rawGeometry as GeoJSON.Polygon).coordinates.map(
      (ring) =>
        ring.map((coord) => [
          Number(coord[0].toFixed(6)),
          Number(coord[1].toFixed(6)),
        ]),
    );
    return {
      type: "Polygon",
      coordinates,
    };
  }

  if (rawGeometry.type === "MultiPolygon") {
    const coordinates = (rawGeometry as GeoJSON.MultiPolygon).coordinates.map(
      (poly) =>
        poly.map((ring) =>
          ring.map((coord) => [
            Number(coord[0].toFixed(6)),
            Number(coord[1].toFixed(6)),
          ]),
        ),
    );
    return {
      type: "MultiPolygon",
      coordinates,
    };
  }

  return null;
};
