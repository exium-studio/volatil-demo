import type GeoJSON from "geojson";

/**
 * Union semua polygon dari FeatureCollection menjadi satu polygon.
 * Simple approach: ambil semua exterior rings dan jadikan MultiPolygon,
 * lalu wrap jadi single Polygon via convex-hull-like bounding.
 * Untuk AOI use case, union koordinat semua rings sudah cukup.
 */
export const unionGeoJsonPolygons = (
  fc: GeoJSON.FeatureCollection,
): GeoJSON.Feature<GeoJSON.Polygon> | null => {
  const rings: number[][][] = [];

  for (const feature of fc.features) {
    const geom = feature.geometry;
    if (!geom) continue;

    if (geom.type === "Polygon") {
      rings.push(geom.coordinates[0]);
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) {
        rings.push(poly[0]);
      }
    }
  }

  if (rings.length === 0) return null;

  // Flatten semua koordinat dari semua rings
  const allCoords = rings.flat();

  // Convex hull sederhana via bounding box untuk union AOI
  const lngs = allCoords.map((c) => c[0]);
  const lats = allCoords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat],
        ],
      ],
    },
  };
};
