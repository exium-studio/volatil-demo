// src/design-system/components/map/utils/geometry.ts

import type GeoJSON from "geojson";
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

/** Interpolates intermediate points along a great circle edge so MapLibre
 * fills the shorter side of the polygon on globe projection. Without this,
 * MapLibre always fills the larger geodesic area regardless of winding order. */
const densifyRing = (points: DrawPoint[], steps = 32): DrawPoint[] => {
  const result: DrawPoint[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      result.push({
        lng: a.lng + (b.lng - a.lng) * t,
        lat: a.lat + (b.lat - a.lat) * t,
      });
    }
  }
  result.push(points[points.length - 1]);
  return result;
};

/** Converts accumulated draw points into a GeoJSON Polygon feature. */
export const toPolygonFeature = (
  points: DrawPoint[],
): GeoJSON.Feature<GeoJSON.Polygon> => {
  const ring = closePolygonRing(points);
  const densified = densifyRing(ring);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [densified.map((p) => [p.lng, p.lat])],
    },
  };
};
