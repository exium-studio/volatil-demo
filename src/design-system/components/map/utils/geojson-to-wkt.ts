// src/design-system/components/map/utils/geojson-to-wkt.ts

import type GeoJSON from "geojson";

/**
 * Converts a GeoJSON Polygon feature to a WKT POLYGON string for GeoServer CQL INTERSECTS queries.
 *
 * GeoServer WFS 1.1+ / 2.0+ with EPSG:4326 strictly expects latitude longitude order
 * in CQL spatial functions: `POLYGON((lat lon, lat lon, ...))`
 *
 * Example output: `POLYGON((-8.66 115.15, -8.66 115.17, -8.68 115.17, -8.68 115.15, -8.66 115.15))`
 */
export const geojsonPolygonToWkt = (
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
): string => {
  const rings = polygon.geometry.coordinates
    .map(
      (ring) =>
        `(${ring.map((coord) => `${coord[1]} ${coord[0]}`).join(", ")})`,
    )
    .join(", ");

  return `POLYGON(${rings})`;
};
