// src/design-system/components/map/stores/map.base-map.store.ts

import type { BasemapKey } from "@/design-system/components/map/types/map.basemap-select.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapBaseMapState {
  activeStyleKey: BasemapKey;
  setActiveStyleKey: (styleKey: BasemapKey) => void;
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
