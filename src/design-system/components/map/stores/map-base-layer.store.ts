// src/design-system/components/map/stores/map-base-layer.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BaseLayerStyleKey } from "@/design-system/components/map/constants/base-layer-style.constant";

interface MapBaseLayerState {
  activeStyleId: BaseLayerStyleKey;
  setActiveStyleId: (styleId: BaseLayerStyleKey) => void;
}

export const useMapBaseLayerStore = create<MapBaseLayerState>()(
  persist(
    (set) => ({
      activeStyleId: "color",
      setActiveStyleId: (activeStyleId) => set({ activeStyleId }),
    }),
    {
      name: "map-base-layer-config",
    },
  ),
);
