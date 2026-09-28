// src/features/mitra/data-request/hooks/use-fly-to-layer.ts

import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type {
  FlyToIgtLayerOptions,
  FlyToLayerTarget,
} from "@/features/mitra/data-request/types/fly-to-layer.type";
import { flyToLayer } from "@/features/mitra/data-request/utils/fly-to-layer";
import { useCallback } from "react";

/**
 * Custom hook to fly map camera to a target IGT layer without manual map instance passing.
 */
export const useFlyToLayer = () => {
  // Stores
  const map = useMapInstanceStore((state) => state.map);

  // Handlers
  const flyTo = useCallback(
    async (layer: FlyToLayerTarget, options?: FlyToIgtLayerOptions) => {
      if (!map) return;
      await flyToLayer(map, layer, options);
    },
    [map],
  );

  return {
    map,
    flyTo,
  };
};
