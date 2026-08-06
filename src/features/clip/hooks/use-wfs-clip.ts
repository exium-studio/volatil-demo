// src/features/clip/hooks/use-wfs-clip.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { useClipStore } from "@/features/clip/stores/use-clip-store";
import type GeoJSON from "geojson";
import { useCallback, useRef } from "react";

/**
 * Fetches WFS features that intersect the clipping polygon using a
 * server-side CQL_FILTER=INTERSECTS(geom, <WKT>) query.
 *
 * GeoServer performs the spatial filter — no client-side Turf intersection needed.
 * Coordinates are in lon/lat order because we use srsName=EPSG:4326.
 *
 * `run` accepts the clipping polygon directly as a parameter so this hook
 * is source-agnostic — callers can pass a polygon from draw, SHP upload, or
 * any other origin without coupling to how the polygon was produced.
 *
 * Results are written to the clip store.
 */
export function useWfsClip() {
  const { setRawWfsFeatures, setClippedFeatures, setStatus, setError } =
    useClipStore();

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (polygon: GeoJSON.Feature<GeoJSON.Polygon>) => {
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
        // Build WKT from the GeoJSON polygon for the CQL spatial filter.
        // Coordinates are lon/lat (matching srsName=EPSG:4326), no axis flip needed.
        const wkt = geojsonPolygonToWkt(polygon);
        const cqlFilter = `INTERSECTS(geom, ${wkt})`;

        const result = await fetchWfs({
          typeName: WFS_LAYER_NAME,
          cqlFilter,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        // GeoServer already filtered — the result IS the clipped set.
        setRawWfsFeatures(result);
        setClippedFeatures(result);
        setStatus("done");
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Unknown error during WFS clip";
        setError(message);
        setStatus("error");
      }
    },
    [setRawWfsFeatures, setClippedFeatures, setStatus, setError],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, [setStatus]);

  return { run, cancel };
}
