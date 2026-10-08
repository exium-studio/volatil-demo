// src/design-system/components/map/utils/geojson-to-wkt.ts

import type GeoJSON from "geojson";

/**
 * Converts a GeoJSON Polygon or MultiPolygon (Feature or Geometry) to a WKT string for GeoServer CQL INTERSECTS queries.
 *
 * GeoServer WFS 2.0 with EPSG:4326 strictly expects latitude longitude order
 * in CQL spatial functions: `POLYGON((lat lon, lat lon, ...))`
 *
 * Example output: `POLYGON((-8.66 115.15, -8.66 115.17, -8.68 115.17, -8.68 115.15, -8.66 115.15))`
 */
const formatCoord = (coord: number[]): string => {
  const lon = Number(coord[0].toFixed(6));
  const lat = Number(coord[1].toFixed(6));
  return `${lon} ${lat}`;
};

export const geojsonPolygonToWkt = (
  polygon?:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | GeoJSON.Feature
    | GeoJSON.Geometry
    | null,
): string => {
  if (!polygon) return "";

  const geometry: GeoJSON.Geometry | undefined =
    "geometry" in polygon && polygon.geometry
      ? polygon.geometry
      : "type" in polygon &&
          (polygon.type === "Polygon" || polygon.type === "MultiPolygon")
        ? (polygon as GeoJSON.Polygon | GeoJSON.MultiPolygon)
        : undefined;

  if (!geometry) return "";

  if (geometry.type === "MultiPolygon") {
    const polys = (geometry as GeoJSON.MultiPolygon).coordinates
      .map((poly) => {
        const rings = poly
          .map(
            (ring) =>
              `(${ring.map((coord) => formatCoord(coord)).join(", ")})`,
          )
          .join(", ");
        return `(${rings})`;
      })
      .join(", ");

    return `MULTIPOLYGON(${polys})`;
  }

  if (geometry.type === "Polygon") {
    const rings = (geometry as GeoJSON.Polygon).coordinates
      .map(
        (ring) =>
          `(${ring.map((coord) => formatCoord(coord)).join(", ")})`,
      )
      .join(", ");

    return `POLYGON(${rings})`;
  }

  return "";
};


