// src/features/mitra/data-request/hooks/use-draw-aoi.tsx

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import {
  useFetchIgtByAoi,
  useFlyToIgtGeometry,
} from "@/features/mitra/data-request/hooks/use-data-request";
import type { IgtDataItem } from "@/features/mitra/data-request/types/igt-by-aoi.type";
import { IconMapPin } from "@tabler/icons-react";
import type GeoJSON from "geojson";
import { useCallback, useMemo } from "react";

const MIN_PURCHASE_COUNT = 1;

export const useDrawAoi = () => {
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const fetchIgtMutation = useFetchIgtByAoi();
  const flyToMutation = useFlyToIgtGeometry();

  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;

  const igtItems = useMemo(
    () => fetchIgtMutation.data ?? [],
    [fetchIgtMutation.data],
  );
  const hasEnoughItems = igtItems.length >= MIN_PURCHASE_COUNT;

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

  const itemActions: DataListItemActionsGenerator<IgtDataItem>[] = useMemo(
    () => [
      (item) => (
        <Menu.Item
          key={"fly-to"}
          value={"fly-to"}
          onClick={() => void flyToMutation.mutateAsync(item.id)}
        >
          <AppIcon icon={IconMapPin} />
          Lihat di Peta
        </Menu.Item>
      ),
    ],
    [flyToMutation],
  );

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
    itemActions,
  };
};
