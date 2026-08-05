// src/features/clip/utils/parse-shp.ts

import shpjs from "shpjs";
import type GeoJSON from "geojson";

/**
 * Parses a .shp (or .zip containing shp) file into a GeoJSON FeatureCollection.
 * Only the first geometry collection is returned if shpjs returns an array.
 */
export async function parseShpToGeoJson(
  file: File,
): Promise<GeoJSON.FeatureCollection> {
  const buffer = await file.arrayBuffer();
  const result = await shpjs(buffer);

  const collection = Array.isArray(result) ? result[0] : result;

  if (!collection || collection.type !== "FeatureCollection") {
    throw new Error("Parsed SHP result is not a valid FeatureCollection");
  }

  return collection as GeoJSON.FeatureCollection;
}

/**
 * Extracts the first Polygon or MultiPolygon feature from a FeatureCollection
 * and normalises it to a simple Polygon by taking the outer ring of the first part.
 */
export function extractFirstPolygon(
  fc: GeoJSON.FeatureCollection,
): GeoJSON.Feature<GeoJSON.Polygon> | null {
  for (const feature of fc.features) {
    if (!feature.geometry) continue;

    if (feature.geometry.type === "Polygon") {
      return feature as GeoJSON.Feature<GeoJSON.Polygon>;
    }

    if (feature.geometry.type === "MultiPolygon") {
      const firstRing = feature.geometry.coordinates[0];
      if (!firstRing) continue;
      return {
        type: "Feature",
        properties: feature.properties,
        geometry: { type: "Polygon", coordinates: firstRing },
      };
    }
  }

  return null;
}
