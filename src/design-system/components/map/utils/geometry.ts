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

const EPSG3857_MAX = 20037508.342789244;

/**
 * Converts Web Mercator (EPSG:3857) meter coordinates to WGS84 (EPSG:4326) [lon, lat].
 */
export const unproject3857To4326 = (x: number, y: number): [number, number] => {
  const lon = (x / EPSG3857_MAX) * 180;
  const lat =
    (Math.atan(Math.exp((y / EPSG3857_MAX) * Math.PI)) * 360) / Math.PI - 90;
  return [Number(lon.toFixed(8)), Number(lat.toFixed(8))];
};

/**
 * Validates and ensures coordinates are in standard [longitude, latitude] GeoJSON format.
 * Automatically converts EPSG:3857 meters if detected, and fixes inverted [lat, lon] coordinates.
 */
export const normalizeCoordinatePair = (
  pair: [number, number] | number[],
): [number, number] => {
  const [first, second] = pair;
  // If coordinates are in Web Mercator (EPSG:3857) meters (|x| > 180 or |y| > 90)
  if (Math.abs(first) > 180 || Math.abs(second) > 90) {
    return unproject3857To4326(first, second);
  }
  // If first number is in latitude range [-11, 10] and second is in Indonesia longitude range [90, 145], it is inverted
  if (Math.abs(first) <= 20 && second >= 90 && second <= 150) {
    return [Number(second.toFixed(8)), Number(first.toFixed(8))];
  }
  return [Number(first.toFixed(8)), Number(second.toFixed(8))];
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
