// src/design-system/components/map/utils/map-camera.ts

import type {
  FitBoundsSafeOptions,
  FlyToSafeOptions,
} from "@/design-system/components/map/types/map.utils.type";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";

/**
 * Safely navigates the map camera to a target center coordinate.
 * Always stops any ongoing camera animations first to prioritize user intent.
 */
export const flyToSafe = (
  map: maplibregl.Map,
  options: FlyToSafeOptions,
): void => {
  if (!map) return;
  try {
    map.stop();
    const { center, zoom = 16, duration = 1200, pitch, bearing } = options;
    map.flyTo({
      center,
      zoom,
      duration,
      pitch,
      bearing,
    });
  } catch (error) {
    console.warn("flyToSafe failed:", error);
  }
};

/**
 * Safely fits map camera bounds to a target bounding box [minLng, minLat, maxLng, maxLat].
 * Always stops any ongoing camera animations first to prioritize user intent.
 * Automatically falls back to flyToSafe if the bounding box represents a single point.
 */
export const fitBoundsSafe = (
  map: maplibregl.Map,
  bbox: [number, number, number, number],
  options?: FitBoundsSafeOptions,
): void => {
  if (!map || !bbox) return;

  try {
    map.stop();
    const [minLng, minLat, maxLng, maxLat] = bbox;
    const isPointBbox = minLng === maxLng && minLat === maxLat;

    if (isPointBbox) {
      flyToSafe(map, {
        center: [minLng, minLat],
        zoom: options?.maxZoom ?? 16,
        duration: options?.duration ?? 1200,
      });
      return;
    }

    const fitBoundsOptions: maplibregl.FitBoundsOptions = {
      padding: options?.padding ?? 80,
      duration: options?.duration ?? 1200,
    };
    if (options?.maxZoom !== undefined) {
      fitBoundsOptions.maxZoom = options.maxZoom;
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      fitBoundsOptions,
    );
  } catch (error) {
    console.warn("fitBoundsSafe failed:", error);
  }
};

/**
 * Zooms to a feature geometry safely with consistent mobile vs desktop logic.
 * On mobile/small viewport, avoiding excessive panel padding prevents zooming out,
 * ensuring high zoom-in clarity.
 */
export const zoomToFeatureSafe = (
  map: maplibregl.Map,
  geometry: GeoJSON.Geometry | null | undefined,
  fallbackCenter?: [number, number],
  isSmallViewport: boolean = false,
): void => {
  if (!map) return;

  if (geometry && geometry.type !== "Point") {
    try {
      // Calculate BBox
      const bbox = turf.bbox({
        type: "Feature",
        properties: {},
        geometry,
      });

      if (isSmallViewport) {
        // On mobile, keep comfortable padding and gentle zoom level
        fitBoundsSafe(map, bbox as [number, number, number, number], {
          padding: { top: 60, bottom: 80, left: 48, right: 48 },
          maxZoom: 15,
          duration: 1000,
        });
      } else {
        fitBoundsSafe(map, bbox as [number, number, number, number], {
          padding: { top: 60, bottom: 60, left: 60, right: 420 },
          maxZoom: 19.5,
          duration: 1000,
        });
      }
      return;
    } catch (error) {
      console.warn("zoomToFeatureSafe fitBounds failed:", error);
    }
  }

  // Fallback to flyTo center if geometry is Point or bbox failed
  const targetCenter =
    fallbackCenter ??
    (geometry && geometry.type === "Point"
      ? (geometry.coordinates as [number, number])
      : undefined);
  if (targetCenter) {
    flyToSafe(map, {
      center: targetCenter,
      zoom: isSmallViewport ? 14.5 : 18.5,
      duration: 1000,
    });
  }
};
