import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import { useWfsClip } from "@/design-system/components/map/hooks/use-wfs-clip";
import type GeoJSON from "geojson";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useMitraDrawAoi = () => {
  // Stores
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const wfsStatus = useWfsClipStore((state) => state.status);
  const wfsError = useWfsClipStore((state) => state.error);
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // Hooks
  const { run: runWfsClip, cancel: cancelWfsClip } = useWfsClip();

  // States
  const [confirmedPolygon, setConfirmedPolygon] =
    useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);

  // Derived Values
  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;

  /**
   * CQL INTERSECTS filter built from the confirmed drawn polygon.
   * undefined until user confirms the draw.
   */
  const aoiCqlFilter = useMemo(() => {
    if (!confirmedPolygon) return undefined;
    const wkt = geojsonPolygonToWkt(confirmedPolygon);
    return `INTERSECTS(geom, ${wkt})`;
  }, [confirmedPolygon]);

  const isDone = confirmedPolygon !== null;

  // Handlers
  const handleResetDraw = useCallback(() => {
    cancelDraw();
    cancelWfsClip();
    resetWfsClipStore();
    setConfirmedPolygon(null);
  }, [cancelDraw, cancelWfsClip, resetWfsClipStore]);

  // Clear draw and wfs clip on unmount
  useEffect(() => {
    return () => {
      cancelDraw();
      cancelWfsClip();
      resetWfsClipStore();
    };
  }, [cancelDraw, cancelWfsClip, resetWfsClipStore]);

  const handleConfirmAndFetch = useCallback(
    async (typeName?: string, wfsUrl?: string) => {
      if (!hasFinishedDraw) return;

      const polygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...points.map((p) => [p.lng, p.lat]),
              [points[0].lng, points[0].lat],
            ],
          ],
        },
      };

      setConfirmedPolygon(polygonFeature);

      // Run WFS clip for map layer visualization if a specific layer is passed
      if (typeName && wfsUrl) {
        void runWfsClip(polygonFeature, typeName, wfsUrl);
      }
    },
    [hasFinishedDraw, points, runWfsClip],
  );

  return {
    isDrawing,
    startDraw: () => start("polygon"),
    cancelDraw: handleResetDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    isLoading: wfsStatus === "fetching" || wfsStatus === "clipping",
    isDone,
    isError: wfsStatus === "error",
    error: wfsError,
    confirmedPolygon,
    aoiCqlFilter,
    handleResetDraw,
    handleConfirmAndFetch,
  };
};

export const useDrawAoi = useMitraDrawAoi;
