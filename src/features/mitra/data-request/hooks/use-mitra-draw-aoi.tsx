// src/features/mitra/data-request/hooks/use-mitra-draw-aoi.tsx

import { useWfsClip } from "@/design-system/components/map/hooks/use-wfs-clip";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import type GeoJSON from "geojson";
import { useCallback, useMemo } from "react";

const MIN_PURCHASE_COUNT = 1;

export const useMitraDrawAoi = () => {
  // Stores
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const clippedFeatures = useWfsClipStore((state) => state.clippedFeatures);
  const wfsStatus = useWfsClipStore((state) => state.status);
  const wfsError = useWfsClipStore((state) => state.error);
  const setClippingPolygon = useWfsClipStore(
    (state) => state.setClippingPolygon,
  );
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // Hooks
  const { run: runWfsClip, cancel: cancelWfsClip } = useWfsClip();

  // Derived Values
  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;

  const wfsFeatures = useMemo(
    () => clippedFeatures?.features ?? [],
    [clippedFeatures],
  );

  const hasEnoughItems = wfsFeatures.length >= MIN_PURCHASE_COUNT;

  // Handlers
  const handleResetDraw = useCallback(() => {
    cancelDraw();
    cancelWfsClip();
    resetWfsClipStore();
  }, [cancelDraw, cancelWfsClip, resetWfsClipStore]);

  const handleConfirmAndFetch = useCallback(async (typeName: string) => {
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

    setClippingPolygon(polygonFeature);
    await runWfsClip(polygonFeature, typeName);
  }, [hasFinishedDraw, points, runWfsClip, setClippingPolygon]);

  return {
    isDrawing,
    startDraw: () => start("polygon"),
    cancelDraw: handleResetDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    isLoading: wfsStatus === "fetching" || wfsStatus === "clipping",
    isDone: wfsStatus === "done",
    isError: wfsStatus === "error",
    error: wfsError,
    hasEnoughItems,
    wfsFeatures,
    handleResetDraw,
    handleConfirmAndFetch,
  };
};

export const useDrawAoi = useMitraDrawAoi;
