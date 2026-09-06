import { isEmptyArray } from "@/shared/utils/data/array";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";

/**
 * Union all Polygon and MultiPolygon features from a FeatureCollection into a single Polygon or MultiPolygon feature.
 * Preserves the exact geometry shape without bounding box approximation.
 */
export const unionGeoJsonPolygons = (
  fc: GeoJSON.FeatureCollection,
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null => {
  const polygonFeatures: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  >[] = [];

  for (const feature of fc.features) {
    const geom = feature.geometry;
    if (!geom) continue;

    if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
      polygonFeatures.push(
        feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
      );
    }
  }

  if (isEmptyArray(polygonFeatures)) return null;

  if (polygonFeatures.length === 1) {
    return polygonFeatures[0];
  }

  try {
    const unionResult = turf.union(turf.featureCollection(polygonFeatures));
    if (
      unionResult &&
      (unionResult.geometry.type === "Polygon" ||
        unionResult.geometry.type === "MultiPolygon")
    ) {
      return unionResult as GeoJSON.Feature<
        GeoJSON.Polygon | GeoJSON.MultiPolygon
      >;
    }
  } catch (error) {
    console.warn("turf.union failed, falling back to MultiPolygon combine:", error);
  }

  // Fallback: combine all polygons into a single MultiPolygon if turf.union fails
  const allCoordinates: GeoJSON.Position[][][] = [];
  for (const feat of polygonFeatures) {
    if (feat.geometry.type === "Polygon") {
      allCoordinates.push(feat.geometry.coordinates);
    } else if (feat.geometry.type === "MultiPolygon") {
      for (const polyCoords of feat.geometry.coordinates) {
        allCoordinates.push(polyCoords);
      }
    }
  }

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPolygon",
      coordinates: allCoordinates,
    },
  };
};
