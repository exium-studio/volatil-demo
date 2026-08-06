// src/design-system/components/map/utils/geojson-to-wkt.ts

import type GeoJSON from "geojson";

/**
 * Converts a GeoJSON Polygon feature to a WKT POLYGON string.
 *
 * Output uses lon/lat coordinate order, which is correct when the WFS request
 * specifies `srsName=EPSG:4326` (axis order = lon, lat — matching GeoJSON).
 *
 * Example output: `POLYGON((106.8 -6.2, 106.9 -6.2, 106.9 -6.3, 106.8 -6.3, 106.8 -6.2))`
 */
export const geojsonPolygonToWkt = (
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
): string => {
  const rings = polygon.geometry.coordinates
    .map(
      (ring) =>
        `(${ring.map((coord) => `${coord[0]} ${coord[1]}`).join(", ")})`,
    )
    .join(", ");

  return `POLYGON(${rings})`;
};
