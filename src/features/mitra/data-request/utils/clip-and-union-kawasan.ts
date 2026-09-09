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
  onProgress?: (progress: number) => void,
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

  // Pre-calculate AOI bounding box to skip non-overlapping features cheaply
  let aoiBbox: [number, number, number, number] | null = null;
  try {
    aoiBbox = turf.bbox(aoiFeature) as [number, number, number, number];
  } catch (err) {
    console.warn("Failed to compute aoi bbox:", err);
  }

  // If AOI has excessive coordinates (e.g. detailed coastlines of entire country/province > 2000 vertices),
  // produce a lightly simplified copy for fast spatial clipping without altering topology drastically.
  let clipTargetAoi = aoiFeature;
  try {
    const totalAoiCoords = turf.coordAll(aoiFeature).length;
    if (totalAoiCoords > 3000) {
      clipTargetAoi = turf.simplify(aoiFeature, {
        tolerance: 0.0005,
        highQuality: false,
        mutate: false,
      }) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    }
  } catch (err) {
    console.warn("Failed to check or simplify complex AOI:", err);
  }

  const clippedPolygons: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  >[] = [];

  const totalRaw = rawFeatures.length;
  let processedCount = 0;

  for (const feature of rawFeatures) {
    processedCount++;
    if (processedCount % 25 === 0 || processedCount === totalRaw) {
      // Scale clipping progress across 60% - 90% range
      const clipRatio = processedCount / totalRaw;
      onProgress?.(Math.round(60 + clipRatio * 30));
    }

    if (!feature || !feature.geometry) continue;

    const geomType = feature.geometry.type;
    if (geomType !== "Polygon" && geomType !== "MultiPolygon") {
      continue;
    }

    // Fast BBox rejection
    if (aoiBbox) {
      try {
        const featBbox = turf.bbox(feature);
        const overlaps = !(
          featBbox[2] < aoiBbox[0] ||
          featBbox[0] > aoiBbox[2] ||
          featBbox[3] < aoiBbox[1] ||
          featBbox[1] > aoiBbox[3]
        );
        if (!overlaps) continue;
      } catch {
        // Continue to exact intersection if bbox calculation fails
      }
    }

    try {
      const intersection = turf.intersect(
        turf.featureCollection([
          feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
          clipTargetAoi,
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

  onProgress?.(95);

  if (isEmptyArray(clippedPolygons)) {
    onProgress?.(100);
    return emptyResult;
  }

  let finalCoveragePolygon:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | null;

  if (clippedPolygons.length === 1) {
    finalCoveragePolygon = clippedPolygons[0];
  } else {
    // Robust Union Algorithm:
    // Pre-clean topologies with buffer(0) or cleanCoords to prevent polygon errors in Turf v7
    const cleanFeature = (
      feat: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
    ): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> => {
      try {
        const cleaned = turf.cleanCoords(feat);
        // buffer(0) dissolves self-intersections and fixes ring topology
        const buffered = turf.buffer(cleaned, 0, { units: "meters" });
        if (
          buffered &&
          "geometry" in buffered &&
          (buffered.geometry.type === "Polygon" ||
            buffered.geometry.type === "MultiPolygon")
        ) {
          return buffered as GeoJSON.Feature<
            GeoJSON.Polygon | GeoJSON.MultiPolygon
          >;
        }
        return cleaned;
      } catch {
        return feat;
      }
    };

    const safeUnionPair = (
      polyA: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
      polyB: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
    ): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> => {
      // 1. Direct union
      try {
        const res = turf.union(turf.featureCollection([polyA, polyB]));
        if (
          res &&
          (res.geometry.type === "Polygon" || res.geometry.type === "MultiPolygon")
        ) {
          return res as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        }
      } catch {
        // Direct union failed, try with cleaned/buffered features
      }

      // 2. Try with clean & buffer(0)
      try {
        const cleanA = cleanFeature(polyA);
        const cleanB = cleanFeature(polyB);
        const res = turf.union(turf.featureCollection([cleanA, cleanB]));
        if (
          res &&
          (res.geometry.type === "Polygon" || res.geometry.type === "MultiPolygon")
        ) {
          return res as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        }
      } catch {
        // Cleaned union failed
      }

      // 3. Last resort fallback for pair: if union fails, keep the larger or polyA rather than doubling coordinates
      return polyA;
    };

    // Perform pairwise folding union across all clipped polygons
    let accumulator = cleanFeature(clippedPolygons[0]);

    for (let i = 1; i < clippedPolygons.length; i++) {
      accumulator = safeUnionPair(accumulator, clippedPolygons[i]);
    }

    finalCoveragePolygon = accumulator;
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

  // console.log("[clipAndUnionKawasan] Result:", {
  //   finalUnionType: finalCoveragePolygon?.geometry.type,
  //   finalUnionCoordinatesCount:
  //     finalCoveragePolygon?.geometry.coordinates.length,
  //   totalAreaHa,
  //   totalClippedPolygons: clippedPolygons.length,
  //   finalCoveragePolygon,
  // });

  onProgress?.(100);

  return {
    coveragePolygon: finalCoveragePolygon,
    totalAreaHa,
    totalIntersectedFeatures: clippedPolygons.length,
    isEmpty: false,
  };
};
