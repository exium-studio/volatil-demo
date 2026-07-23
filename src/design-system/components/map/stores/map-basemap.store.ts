// src/design-system/components/map/stores/map-basemap.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BasemapStyleId } from "@/design-system/components/map/constants/basemap.constant";

interface MapBasemapState {
  activeStyleId: BasemapStyleId;
  setActiveStyleId: (styleId: BasemapStyleId) => void;
}

export const useMapBasemapStore = create<MapBasemapState>()(
  persist(
    (set) => ({
      activeStyleId: "color",
      setActiveStyleId: (activeStyleId) => set({ activeStyleId }),
    }),
    {
      name: "map-basemap-config",
    },
  ),
);
