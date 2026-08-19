// src/features/mitra/data-request/utils/calculate-feature-area.ts

import * as turf from "@turf/turf";
import type GeoJSON from "geojson";

/**
 * Calculates the area of a GeoJSON Feature or Geometry in hectares (ha).
 * 1 hectare = 10,000 m².
 * Returns 0 if geometry is not a Polygon / MultiPolygon or invalid.
 */
export function calculateFeatureAreaInHectares(
  featureOrGeometry:
    | GeoJSON.Feature
    | GeoJSON.Geometry
    | GeoJSON.FeatureCollection
    | null
    | undefined,
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

/**
 * Extracts GeoJSON Polygon features from a CQL filter containing INTERSECTS(geom, POLYGON(...)).
 * Handles single or multiple OR-ed INTERSECTS clauses.
 */
export function extractAoiPolygonsFromCql(
  cqlFilter?: string,
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null {
  if (!cqlFilter || !cqlFilter.includes("INTERSECTS")) return null;

  try {
    // Match all POLYGON((...)) inside the CQL filter
    const polygonMatches = cqlFilter.match(/POLYGON\s*\(\s*\(([^)]+)\)\s*\)/gi);
    if (!polygonMatches || polygonMatches.length === 0) return null;

    const parsedPolygons: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

    for (const match of polygonMatches) {
      // Extract numbers inside POLYGON((lat lon, ...))
      const inner = match
        .replace(/POLYGON\s*\(\s*\(/i, "")
        .replace(/\)\s*\)$/, "");
      const pairs = inner.split(",").map((p) => p.trim());
      const coords: number[][] = [];

      for (const pair of pairs) {
        const parts = pair.split(/\s+/).map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          // Note: geojsonPolygonToWkt produces lat lon. Turf expects GeoJSON standard [lng, lat]
          const [lat, lng] = parts;
          coords.push([lng, lat]);
        }
      }

      if (coords.length >= 4) {
        parsedPolygons.push({
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [coords],
          },
        });
      }
    }

    if (parsedPolygons.length === 0) return null;
    if (parsedPolygons.length === 1) return parsedPolygons[0];

    // If multiple AOIs, combine them into a MultiPolygon or union
    const multiCoords = parsedPolygons.map((p) => p.geometry.coordinates);
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: multiCoords,
      },
    };
  } catch (error) {
    console.warn("Failed to extract AOI polygon from CQL:", error);
    return null;
  }
}

/**
 * Calculates the intersected area between a target GeoJSON feature and an AOI polygon (in Hectares).
 * If no AOI is provided or intersection is not applicable, returns full feature area.
 */
export function calculateIntersectAreaInHectares(
  feature: GeoJSON.Feature | GeoJSON.Geometry | null | undefined,
  aoiPolygon?: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null,
): number {
  if (!feature) return 0;

  const targetFeature: GeoJSON.Feature =
    "type" in feature && feature.type === "Feature"
      ? (feature as GeoJSON.Feature)
      : {
          type: "Feature",
          properties: {},
          geometry: feature as GeoJSON.Geometry,
        };

  if (!targetFeature.geometry) return 0;

  // If no AOI is provided, calculate the full feature area
  if (!aoiPolygon || !aoiPolygon.geometry) {
    return calculateFeatureAreaInHectares(targetFeature);
  }

  try {
    const featGeomType = targetFeature.geometry.type;
    const aoiGeomType = aoiPolygon.geometry.type;

    // Only Polygon / MultiPolygon can be intersected
    const isFeatPoly =
      featGeomType === "Polygon" || featGeomType === "MultiPolygon";
    const isAoiPoly =
      aoiGeomType === "Polygon" || aoiGeomType === "MultiPolygon";

    if (!isFeatPoly || !isAoiPoly) {
      return calculateFeatureAreaInHectares(targetFeature);
    }

    const intersection = turf.intersect(
      turf.featureCollection([
        targetFeature as GeoJSON.Feature<
          GeoJSON.Polygon | GeoJSON.MultiPolygon
        >,
        aoiPolygon,
      ]),
    );

    if (!intersection) {
      return 0;
    }

    return calculateFeatureAreaInHectares(intersection);
  } catch (error) {
    console.warn("Failed to compute intersection with turf:", error);
    return calculateFeatureAreaInHectares(targetFeature);
  }
}
