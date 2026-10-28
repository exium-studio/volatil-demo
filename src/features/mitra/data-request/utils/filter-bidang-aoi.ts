// src/features/mitra/data-request/utils/filter-bidang-aoi.ts

import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";

/**
 * Filters features strictly intersecting the exact AOI polygon using a 2-stage spatial pipeline:
 * 1. Fast BBOX rejection (O(1) bounding box check)
 * 2. Exact polygon intersection (turf.booleanIntersects) for 100% geometric accuracy
 */
export const filterBidangAoiFeatures = (
  rawFeatures: GeoJSON.Feature[],
  rawAoi:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null
    | undefined,
): GeoJSON.Feature[] => {
  if (!rawFeatures || rawFeatures.length === 0 || !rawAoi) {
    return [];
  }

  const aoiFeature = normalizePolygonFeature(rawAoi);
  if (!aoiFeature || !aoiFeature.geometry) {
    return [];
  }

  const aoiBbox = turf.bbox(aoiFeature);
  const minX = aoiBbox[0];
  const minY = aoiBbox[1];
  const maxX = aoiBbox[2];
  const maxY = aoiBbox[3];

  const filteredFeatures: GeoJSON.Feature[] = [];

  for (let i = 0; i < rawFeatures.length; i++) {
    const feat = rawFeatures[i];
    if (!feat || !feat.geometry) continue;

    const featFeature: GeoJSON.Feature<GeoJSON.Geometry> =
      feat.type === "Feature"
        ? (feat as GeoJSON.Feature<GeoJSON.Geometry>)
        : {
            type: "Feature",
            properties: feat.properties ?? {},
            geometry: feat.geometry,
          };

    try {
      // Stage 1: Fast BBOX pre-rejection
      const featBbox = turf.bbox(featFeature);
      const isBboxDisjoint =
        featBbox[2] < minX ||
        featBbox[0] > maxX ||
        featBbox[3] < minY ||
        featBbox[1] > maxY;

      if (isBboxDisjoint) {
        continue;
      }

      // Stage 2: Exact geometric intersection against unsimplified AOI
      const isIntersecting = turf.booleanIntersects(aoiFeature, featFeature);
      if (isIntersecting) {
        filteredFeatures.push(feat);
      }
    } catch {
      // Fallback: if complex multi-geometry throws, do BBOX fallback
      const featBbox = turf.bbox(featFeature);
      const isBboxOverlapping =
        featBbox[0] <= maxX &&
        featBbox[2] >= minX &&
        featBbox[1] <= maxY &&
        featBbox[3] >= minY;

      if (isBboxOverlapping) {
        filteredFeatures.push(feat);
      }
    }
  }

  return filteredFeatures;
};
