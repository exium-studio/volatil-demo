// src/features/map/utils/geometry.util.ts

import type { Feature, Polygon } from "geojson";
import type { DrawPoint } from "@/design-system/components/map/types/map.type";

interface PixelPoint {
  x: number;
  y: number;
}

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
export const toPolygonFeature = (points: DrawPoint[]): Feature<Polygon> => {
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
