// src/design-system/components/map/stores/map-base-layer.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BaseLayerStyleKey } from "@/design-system/components/map/constants/base-layer-style.constant";

interface MapBaseLayerState {
  activeStyleKey: BaseLayerStyleKey;
  setActiveStyleKey: (styleKey: BaseLayerStyleKey) => void;
}

export const useMapBaseLayerStore = create<MapBaseLayerState>()(
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
