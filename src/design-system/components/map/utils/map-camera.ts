// src/design-system/components/map/utils/map-camera.ts

import type maplibregl from "maplibre-gl";

type FlyToSafeOptions = {
  center: [number, number];
  zoom?: number;
  duration?: number;
  pitch?: number;
  bearing?: number;
};

type FitBoundsSafeOptions = {
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  maxZoom?: number;
  duration?: number;
};

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

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: options?.padding ?? 80,
        maxZoom: options?.maxZoom ?? 16,
        duration: options?.duration ?? 1200,
      },
    );
  } catch (error) {
    console.warn("fitBoundsSafe failed:", error);
  }
};
