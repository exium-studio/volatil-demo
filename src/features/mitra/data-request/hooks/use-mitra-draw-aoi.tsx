// src/features/mitra/data-request/hooks/use-mitra-draw-aoi.tsx

import { useWfsClip } from "@/design-system/components/map/hooks/use-wfs-clip";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { toPolygonFeature } from "@/design-system/components/map/utils/geometry";
import { useCallback, useMemo, useState } from "react";

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

  /** Drawn polygon GeoJSON feature directly from the accumulated points SSOT during active draw */
  const drawnPolygon = useMemo(() => {
    if (points.length < 3) return null;
    return toPolygonFeature(points);
  }, [points]);

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
    setConfirmedPolygon(null);
    cancelDraw();
    cancelWfsClip();
    resetWfsClipStore();
  }, [cancelDraw, cancelWfsClip, resetWfsClipStore]);

  const handleConfirmAndFetch = useCallback(
    async (typeName?: string, wfsUrl?: string) => {
      if (!hasFinishedDraw || !drawnPolygon) return;

      const polygonToConfirm = drawnPolygon;
      setConfirmedPolygon(polygonToConfirm);
      // Clear in-progress draw points so useMapDraw does not duplicate the layer with useCartAoiCoverageMap
      cancelDraw();

      // Run WFS clip for map layer visualization if a specific layer is passed
      if (typeName && wfsUrl) {
        void runWfsClip(polygonToConfirm, typeName, wfsUrl);
      }
    },
    [hasFinishedDraw, drawnPolygon, cancelDraw, runWfsClip],
  );

  return {
    isDrawing,
    startDraw: () => {
      setConfirmedPolygon(null);
      start("polygon");
    },
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
