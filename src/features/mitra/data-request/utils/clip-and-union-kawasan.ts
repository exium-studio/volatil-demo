// src/features/mitra/data-request/utils/clip-and-union-kawasan.ts

import type { KawasanCoverageResult } from "@/features/mitra/data-request/types/mitra.data-request.coverage.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";

/**
 * Normalizes input geometry into a GeoJSON Feature<Polygon | MultiPolygon>.
 */
export const normalizePolygonFeature = (
  geomOrFeature:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null
    | undefined,
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null => {
  if (!geomOrFeature) return null;

  if ("type" in geomOrFeature && geomOrFeature.type === "Feature") {
    const f = geomOrFeature as GeoJSON.Feature;
    if (
      f.geometry &&
      (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
    ) {
      return f as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    }
    return null;
  }

  if (
    "type" in geomOrFeature &&
    (geomOrFeature.type === "Polygon" || geomOrFeature.type === "MultiPolygon")
  ) {
    return {
      type: "Feature",
      properties: {},
      geometry: geomOrFeature as GeoJSON.Polygon | GeoJSON.MultiPolygon,
    };
  }

  return null;
};

/**
 * Clips an array of GeoJSON features against an AOI boundary polygon,
 * then executes unary union across all clipped polygon geometries.
 *
 * Technical Steps:
 * 1. For each feature, intersect with AOI boundary (clip to boundary).
 * 2. Collect all valid intersection polygon/multipolygon fragments.
 * 3. Perform unary union with Turf.js to produce 1 outer coverage polygon.
 * 4. Calculate total coverage area in hectares (ha) using turf.area() / 10000.
 */
export const clipAndUnionKawasanFeatures = (
  rawFeatures: GeoJSON.Feature[],
  aoiPolygonInput:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null
    | undefined,
): KawasanCoverageResult => {
  const emptyResult: KawasanCoverageResult = {
    coveragePolygon: null,
    totalAreaHa: 0,
    totalIntersectedFeatures: 0,
    isEmpty: true,
  };

  const aoiFeature = normalizePolygonFeature(aoiPolygonInput);
  if (!aoiFeature || isEmptyArray(rawFeatures)) {
    return emptyResult;
  }

  const clippedPolygons: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  >[] = [];

  for (const feature of rawFeatures) {
    if (!feature || !feature.geometry) continue;

    const geomType = feature.geometry.type;
    if (geomType !== "Polygon" && geomType !== "MultiPolygon") {
      continue;
    }

    try {
      const intersection = turf.intersect(
        turf.featureCollection([
          feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
          aoiFeature,
        ]),
      );

      if (
        intersection &&
        (intersection.geometry.type === "Polygon" ||
          intersection.geometry.type === "MultiPolygon")
      ) {
        clippedPolygons.push(
          intersection as GeoJSON.Feature<
            GeoJSON.Polygon | GeoJSON.MultiPolygon
          >,
        );
      }
    } catch (err) {
      console.warn("Intersection clip error for feature:", err);
    }
  }

  if (isEmptyArray(clippedPolygons)) {
    return emptyResult;
  }

  let finalCoveragePolygon: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  > | null = null;

  if (clippedPolygons.length === 1) {
    finalCoveragePolygon = clippedPolygons[0];
  } else {
    try {
      const unionResult = turf.union(turf.featureCollection(clippedPolygons));
      if (
        unionResult &&
        (unionResult.geometry.type === "Polygon" ||
          unionResult.geometry.type === "MultiPolygon")
      ) {
        finalCoveragePolygon = unionResult as GeoJSON.Feature<
          GeoJSON.Polygon | GeoJSON.MultiPolygon
        >;
      }
    } catch (error) {
      console.warn("turf.union failed, falling back to MultiPolygon combine:", error);
    }

    // Fallback: merge coordinates into MultiPolygon if turf.union failed
    if (!finalCoveragePolygon) {
      const allCoords: GeoJSON.Position[][][] = [];
      for (const feat of clippedPolygons) {
        if (feat.geometry.type === "Polygon") {
          allCoords.push(feat.geometry.coordinates);
        } else if (feat.geometry.type === "MultiPolygon") {
          for (const polyCoords of feat.geometry.coordinates) {
            allCoords.push(polyCoords);
          }
        }
      }

      finalCoveragePolygon = {
        type: "Feature",
        properties: {
          isFallbackMultiPolygon: true,
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: allCoords,
        },
      };
    }
  }

  let totalAreaHa = 0;
  if (finalCoveragePolygon) {
    try {
      const areaM2 = turf.area(finalCoveragePolygon);
      if (!isNaN(areaM2) && areaM2 > 0) {
        totalAreaHa = areaM2 / 10000;
      }
    } catch (err) {
      console.warn("Failed to calculate turf area on coverage polygon:", err);
    }
  }

  return {
    coveragePolygon: finalCoveragePolygon,
    totalAreaHa,
    totalIntersectedFeatures: clippedPolygons.length,
    isEmpty: false,
  };
};
