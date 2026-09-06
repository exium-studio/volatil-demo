// src/design-system/components/map/stores/map.base-map.store.ts

import type { MapBaseMapState } from "@/design-system/components/map/types/map.basemap.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMapBaseMapStore = create<MapBaseMapState>()(
  persist(
    (set) => ({
      activeStyleKey: "color",
      setActiveStyleKey: (activeStyleKey) => set({ activeStyleKey }),
      is3D: false,
      setIs3D: (is3D) => set({ is3D }),
      toggle3D: () => set((state) => ({ is3D: !state.is3D })),
    }),
    {
      name: "map-base-layer-config",
    },
  ),
);
