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

  const cleanFeature = (
    feat: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
  ): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> => {
    try {
      const cleaned = turf.cleanCoords(feat);
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
    try {
      const res = turf.union(turf.featureCollection([polyA, polyB]));
      if (
        res &&
        (res.geometry.type === "Polygon" || res.geometry.type === "MultiPolygon")
      ) {
        return res as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
      }
    } catch {
      // ignore
    }

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
      // ignore
    }

    return polyA;
  };

  let accumulator = cleanFeature(polygonFeatures[0]);
  for (let i = 1; i < polygonFeatures.length; i++) {
    accumulator = safeUnionPair(accumulator, polygonFeatures[i]);
  }

  return accumulator;
};
