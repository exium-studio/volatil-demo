// src/features/mitra/data-request/hooks/use-mitra-draw-aoi.tsx


import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";

import { useFetchIgtByAoi } from "@/features/mitra/data-request/hooks/use-mitra-data-request";

import type GeoJSON from "geojson";
import { useCallback, useMemo } from "react";

const MIN_PURCHASE_COUNT = 1;

export const useMitraDrawAoi = () => {
  // Stores
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();

  // Mutations
  const fetchIgtMutation = useFetchIgtByAoi();


  // Derived Values
  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;

  const igtItems = useMemo(
    () => fetchIgtMutation.data ?? [],
    [fetchIgtMutation.data],
  );
  const hasEnoughItems = igtItems.length >= MIN_PURCHASE_COUNT;

  // Handlers
  const handleResetDraw = useCallback(() => {
    fetchIgtMutation.reset();
    cancelDraw();
  }, [cancelDraw, fetchIgtMutation]);

  const handleConfirmAndFetch = useCallback(async () => {
    if (!hasFinishedDraw) return;

    const polygon: GeoJSON.Polygon = {
      type: "Polygon",
      coordinates: [
        [...points.map((p) => [p.lng, p.lat]), [points[0].lng, points[0].lat]],
      ],
    };

    await fetchIgtMutation.mutateAsync(polygon);
  }, [fetchIgtMutation, hasFinishedDraw, points]);



  return {
    isDrawing,
    startDraw: () => start("polygon"),
    cancelDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    isLoading: fetchIgtMutation.isPending,
    isDone: fetchIgtMutation.isSuccess,
    isError: fetchIgtMutation.isError,
    error: fetchIgtMutation.error,
    hasEnoughItems,
    igtItems,
    handleResetDraw,
    handleConfirmAndFetch,

  };
};

export const useDrawAoi = useMitraDrawAoi;
