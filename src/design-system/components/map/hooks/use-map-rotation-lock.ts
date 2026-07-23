// src/features/map/hooks/use-map-rotation-lock.ts

import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { useMapInteractionStore } from "@/design-system/components/map/stores/map-interaction.store";

/** Syncs the rotation-lock toggle (store) to MapLibre's drag-rotate / touch-rotate handlers. */
export const useMapRotationLock = (map: maplibregl.Map | null) => {
  const isRotationLocked = useMapInteractionStore((s) => s.isRotationLocked);

  useEffect(() => {
    if (!map) return;

    if (isRotationLocked) {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
    } else {
      map.dragRotate.enable();
      map.touchZoomRotate.enableRotation();
    }
  }, [map, isRotationLocked]);
};
