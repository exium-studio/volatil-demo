// src/features/mitra/data-request/utils/fly-to-layer.ts

import { toast } from "@/design-system/components/toast";
import type {
  FlyToIgtLayerOptions,
  FlyToLayerTarget,
} from "@/features/mitra/data-request/types/fly-to-layer.type";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";
import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * Extracts a GeoJSON polygon/geometry from layer target or options if present.
 */
const resolveGeoJsonObject = (
  layer: FlyToLayerTarget,
  options?: FlyToIgtLayerOptions,
): GeoJSON.Feature | GeoJSON.FeatureCollection | GeoJSON.Geometry | null => {
  if (options?.aoiPolygon) {
    return {
      type: "Feature",
      properties: {},
      geometry: options.aoiPolygon,
    };
  }

  if (options?.geojson) {
    return options.geojson;
  }

  const target = layer as Record<string, unknown>;
  if (target.polygon) {
    return {
      type: "Feature",
      properties: {},
      geometry: target.polygon as GeoJSON.Geometry,
    };
  }

  if (target.geojson) {
    return target.geojson as GeoJSON.Feature | GeoJSON.FeatureCollection;
  }

  if (target.geometry) {
    return {
      type: "Feature",
      properties: {},
      geometry: target.geometry as GeoJSON.Geometry,
    };
  }

  if (
    target.data &&
    typeof target.data === "object" &&
    "type" in target.data &&
    ("coordinates" in target.data || "geometry" in target.data || "features" in target.data)
  ) {
    return target.data as GeoJSON.Feature | GeoJSON.FeatureCollection;
  }

  return null;
};

/**
 * Flies map viewport to fit a layer or polygon feature.
 * - If GeoJSON/polygon feature data is present, bbox is computed directly from it.
 * - If layer is from BE response, it uses layer.bbox.
 * - If bbox is not found, fires a warning toast.
 */
export const flyToLayer = async (
  map: MapLibreMap | null,
  layer: FlyToLayerTarget,
  options?: FlyToIgtLayerOptions,
) => {
  if (!map) return;

  let bbox: [number, number, number, number] | null = null;

  // 1. If GeoJSON / polygon feature data is available (e.g. loaded on FE or AOI), compute bbox directly from polygon
  const geojsonObj = resolveGeoJsonObject(layer, options);
  if (geojsonObj) {
    try {
      const computed = turf.bbox(geojsonObj as turf.AllGeoJSON);
      if (
        Array.isArray(computed) &&
        computed.length === 4 &&
        computed.every((n) => typeof n === "number" && !Number.isNaN(n) && Number.isFinite(n))
      ) {
        bbox = [computed[0], computed[1], computed[2], computed[3]];
      }
    } catch {
      // Fall through to static bbox
    }
  }

  // 2. If no GeoJSON polygon, use bbox provided by BE response
  if (!bbox) {
    const rawBbox = options?.bbox ?? layer.bbox;
    if (
      Array.isArray(rawBbox) &&
      rawBbox.length === 4 &&
      rawBbox.every((n) => typeof n === "number" && !Number.isNaN(n) && Number.isFinite(n))
    ) {
      bbox = [rawBbox[0], rawBbox[1], rawBbox[2], rawBbox[3]];
    }
  }

  // 3. If still no bbox, fire toast
  if (!bbox) {
    toast.warning("Informasi batas wilayah (bbox) tidak ditemukan untuk layer ini");
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
