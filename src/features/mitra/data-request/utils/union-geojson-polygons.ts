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
    if (polygonFeatures.length > 50) {
      let currentBatch = [...polygonFeatures];
      const chunkSize = 25;

      while (currentBatch.length > 1 && currentBatch.length <= 500) {
        const nextBatch: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] = [];
        for (let i = 0; i < currentBatch.length; i += chunkSize) {
          const chunk = currentBatch.slice(i, i + chunkSize);
          if (chunk.length === 1) {
            nextBatch.push(chunk[0]);
          } else {
            const chunkUnion = turf.union(turf.featureCollection(chunk));
            if (chunkUnion && (chunkUnion.geometry.type === "Polygon" || chunkUnion.geometry.type === "MultiPolygon")) {
              nextBatch.push(chunkUnion as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>);
            } else {
              nextBatch.push(...chunk);
            }
          }
        }
        if (nextBatch.length >= currentBatch.length) {
          currentBatch = nextBatch;
          break;
        }
        currentBatch = nextBatch;
      }

      const finalUnion = turf.union(turf.featureCollection(currentBatch));
      if (
        finalUnion &&
        (finalUnion.geometry.type === "Polygon" ||
          finalUnion.geometry.type === "MultiPolygon")
      ) {
        return finalUnion as GeoJSON.Feature<
          GeoJSON.Polygon | GeoJSON.MultiPolygon
        >;
      }
    } else {
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
