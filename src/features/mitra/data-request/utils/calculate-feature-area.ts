// src/features/mitra/data-request/utils/calculate-feature-area.ts

import * as turf from "@turf/turf";
import type GeoJSON from "geojson";

/**
 * Calculates the area of a GeoJSON Feature or Geometry in hectares (ha).
 * 1 hectare = 10,000 m².
 * Returns 0 if geometry is not a Polygon / MultiPolygon or invalid.
 */
export function calculateFeatureAreaInHectares(
  featureOrGeometry: GeoJSON.Feature | GeoJSON.Geometry | GeoJSON.FeatureCollection | null | undefined,
): number {
  if (!featureOrGeometry) return 0;

  try {
    const areaInSquareMeters = turf.area(featureOrGeometry as turf.AllGeoJSON);
    if (!areaInSquareMeters || isNaN(areaInSquareMeters)) {
      return 0;
    }
    // 1 ha = 10,000 m²
    return areaInSquareMeters / 10000;
  } catch (error) {
    console.warn("Failed to calculate feature area with turf:", error);
    return 0;
  }
}
