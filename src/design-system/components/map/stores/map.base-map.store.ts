// src/design-system/components/map/stores/map-base-layer.store.ts

import type { BaseLayerStyleKey } from "@/design-system/components/map/types/basemap.select.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapBaseMapState {
  activeStyleKey: BaseLayerStyleKey;
  setActiveStyleKey: (styleKey: BaseLayerStyleKey) => void;
}

export const useMapBaseMapStore = create<MapBaseMapState>()(
  persist(
    (set) => ({
      activeStyleKey: "color",
      setActiveStyleKey: (activeStyleKey) => set({ activeStyleKey }),
    }),
    {
      name: "map-base-layer-config",
    },
  ),
);
