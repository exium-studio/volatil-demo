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
 * Validates and ensures coordinates are in standard [longitude, latitude] GeoJSON format.
 * In Indonesia, longitude is roughly ~95 to 142 and latitude is roughly -11 to 6.
 * If coordinates are inverted ([lat, lon]), this automatically swaps them.
 */
export const normalizeCoordinatePair = (
  pair: [number, number] | number[],
): [number, number] => {
  const [first, second] = pair;
  // If first number is in latitude range [-11, 10] and second is in Indonesia longitude range [90, 145], it is inverted
  if (Math.abs(first) <= 20 && second >= 90 && second <= 150) {
    return [Number(second.toFixed(6)), Number(first.toFixed(6))];
  }
  return [Number(first.toFixed(6)), Number(second.toFixed(6))];
};

/**
 * Recursively normalizes all coordinate pairs within any GeoJSON geometry to [lon, lat].
 */
export const normalizeGeometryCoordinates = <T extends GeoJSON.Geometry>(
  geometry: T,
): T => {
  if (!geometry) return geometry;

  if (geometry.type === "Point") {
    return {
      ...geometry,
      coordinates: normalizeCoordinatePair(geometry.coordinates),
    };
  }

  if (geometry.type === "MultiPoint" || geometry.type === "LineString") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((c) => normalizeCoordinatePair(c)),
    };
  }

  if (geometry.type === "MultiLineString" || geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((ring) =>
        ring.map((c) => normalizeCoordinatePair(c)),
      ),
    };
  }

  if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((poly) =>
        poly.map((ring) => ring.map((c) => normalizeCoordinatePair(c))),
      ),
    };
  }

  return geometry;
};

/**
 * Normalizes input geometry into a strictly 2D GeoJSON Polygon or MultiPolygon Geometry.
 * Extracts geometry from Feature, strips any extra Z/elevation values, trims coordinate decimals,
 * and ensures standard [longitude, latitude] axis order.
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
      (ring) => ring.map((coord) => normalizeCoordinatePair(coord)),
    );
    return {
      type: "Polygon",
      coordinates,
    };
  }

  if (rawGeometry.type === "MultiPolygon") {
    const coordinates = (rawGeometry as GeoJSON.MultiPolygon).coordinates.map(
      (poly) =>
        poly.map((ring) => ring.map((coord) => normalizeCoordinatePair(coord))),
    );
    return {
      type: "MultiPolygon",
      coordinates,
    };
  }

  return null;
};
