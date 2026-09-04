// src/features/mitra/data-request/utils/fly-to-igt-layer.ts

import type {
  FlyToIgtLayerOptions,
  FlyToLayerTarget,
} from "@/features/mitra/data-request/types/fly-to-layer.type";
import { toast } from "@/design-system/components/toast";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import type GeoJSON from "geojson";
import type { Map as MapLibreMap } from "maplibre-gl";

export type { FlyToIgtLayerOptions, FlyToLayerTarget };

/**
 * Computes a bounding box [minLng, minLat, maxLng, maxLat] from GeoJSON FeatureCollection.
 */
export const computeGeoJsonBbox = (
  featureCollection: GeoJSON.FeatureCollection,
): [number, number, number, number] | null => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let hasCoords = false;

  const traverse = (coords: unknown) => {
    if (!Array.isArray(coords) || isEmptyArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const lng = coords[0];
      const lat = coords[1];
      if (lng >= 100 && lng <= 145 && lat >= -15 && lat <= 10) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
        hasCoords = true;
      }
    } else {
      for (const item of coords) {
        traverse(item);
      }
    }
  };

  for (const feat of featureCollection.features ?? []) {
    if (feat.geometry) {
      traverse(
        (feat.geometry as unknown as { coordinates: unknown }).coordinates,
      );
    }
  }

  if (!hasCoords) return null;
  return [minLng, minLat, maxLng, maxLat];
};

/**
 * Fetches dynamic bbox for a layer with optional CQL Filter applied.
 */
export const fetchLayerDynamicBbox = async (
  typeName: string,
  wfsUrl: string,
  cqlFilter?: string,
): Promise<[number, number, number, number] | null> => {
  try {
    const geojson = await fetchWfs({
      typeName,
      wfsUrl,
      cqlFilter,
      maxFeatures: 50,
      version: "2.0.0",
    });

    if (geojson.features && geojson.features.length > 0) {
      return computeGeoJsonBbox(geojson);
    }
  } catch (error) {
    console.warn("Filtered WFS bbox fetch failed:", error);
  }
  return null;
};

/**
 * Flies map viewport to fit the bounding box (bbox) of an IGT layer.
 * Warns via toast if bounding box is not provided and cannot be dynamically resolved.
 */
export const flyToIgtLayer = async (
  map: MapLibreMap | null,
  layer: FlyToLayerTarget,
  options?: FlyToIgtLayerOptions,
) => {
  if (!map) return;

  const { cqlFilter, fetchBoundary = false } = options ?? {};

  // If fetchBoundary is requested, try fetching WFS features
  if (fetchBoundary && layer.wfs?.wfsTypeName && layer.wfs?.wfsUrl) {
    try {
      const featureCollection = await fetchWfs({
        typeName: layer.wfs.wfsTypeName,
        wfsUrl: layer.wfs.wfsUrl,
        cqlFilter,
        maxFeatures: 100,
      });

      if (featureCollection.features && featureCollection.features.length > 0) {
        highlightFeatureOnMap(map, featureCollection, {
          zoom: 15,
        });
        return;
      }
    } catch (error) {
      console.warn(
        "WFS boundary fetch failed, falling back to layer bbox:",
        error,
      );
    }
  }

  // Use the exact `bbox` from the layer response
  let bbox: [number, number, number, number] | null = layer.bbox ?? null;

  // If no static bbox exists and cqlFilter is active, fetch dynamic bbox
  if (!bbox && cqlFilter && layer.wfs?.wfsTypeName && layer.wfs?.wfsUrl) {
    bbox = await fetchLayerDynamicBbox(
      layer.wfs.wfsTypeName,
      layer.wfs.wfsUrl,
      cqlFilter,
    );
  }

  // If still no bbox, notify user with warning toast
  if (!bbox) {
    toast.warning("Informasi batas wilayah (bbox) tidak disediakan untuk layer ini");
    return;
  }

  const [minLng, minLat, maxLng, maxLat] = bbox;

  const bboxPolygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: { id: layer.id, title: layer.title || layer.id },
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

  highlightFeatureOnMap(map, bboxPolygonFeature, {
    zoom: 15,
  });
};
