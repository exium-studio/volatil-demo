// src/features/clip/hooks/use-wfs-clip.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import {
  WFS_LAYER_NAME,
} from "@/design-system/components/map/constants/map.config";
import { useClipStore } from "@/features/clip/stores/use-clip-store";
import { bbox, intersect } from "@turf/turf";
import type GeoJSON from "geojson";
import { useCallback, useRef } from "react";

/**
 * Fetches WFS features inside the clipping polygon's bbox,
 * then intersects each feature with the polygon using Turf.
 *
 * `run` accepts the clipping polygon directly as a parameter so this hook
 * is source-agnostic — callers can pass a polygon from draw, SHP upload, or
 * any other origin without coupling to how the polygon was produced.
 *
 * Results are written to the clip store.
 */
export function useWfsClip() {
  const {
    setRawWfsFeatures,
    setClippedFeatures,
    setStatus,
    setError,
  } = useClipStore();

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (polygon: GeoJSON.Feature<GeoJSON.Polygon>) => {
    if (!polygon) return;

    // Cancel any in-flight request before starting a new one.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("fetching");
    setError(null);
    setRawWfsFeatures(null);
    setClippedFeatures(null);

    try {
      // Compute bbox from the clipping polygon.
      const [minLng, minLat, maxLng, maxLat] = bbox(polygon);

      const raw = await fetchWfs({
        typeName: WFS_LAYER_NAME,
        bbox: [minLng, minLat, maxLng, maxLat],
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      setRawWfsFeatures(raw);
      setStatus("clipping");

      // Clip each fetched feature against the clipping polygon.
      const clippedFeatures: GeoJSON.Feature[] = [];

      for (const feature of raw.features) {
        if (
          !feature.geometry ||
          (feature.geometry.type !== "Polygon" &&
            feature.geometry.type !== "MultiPolygon")
        ) {
          continue;
        }

        const fcToIntersect: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> = {
          type: "FeatureCollection",
          features: [
            feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
            polygon
          ]
        };

        const clipped = intersect(fcToIntersect);

        if (clipped) {
          clippedFeatures.push({
            ...clipped,
            properties: feature.properties,
          });
        }
      }

      const clippedFc: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: clippedFeatures,
      };

      setClippedFeatures(clippedFc);
      setStatus("done");
    } catch (err: unknown) {
      if ((err as { name?: string }).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Unknown error during WFS clip";
      setError(message);
      setStatus("error");
    }
  }, [
    setRawWfsFeatures,
    setClippedFeatures,
    setStatus,
    setError,
  ]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, [setStatus]);

  return { run, cancel };
}
