// src/features/mitra/data-request/hooks/use-fly-to-layer.ts

import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type {
  FlyToIgtLayerOptions,
  FlyToLayerTarget,
} from "@/features/mitra/data-request/types/fly-to-layer.type";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
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
      await flyToIgtLayer(map, layer, options);
    },
    [map],
  );

  return {
    map,
    flyTo,
  };
};
