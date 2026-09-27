// src/design-system/components/map/stores/map.layer.store.ts

// src\design-system\components\map\stores\map.layer.store.ts

// src\design-system\components\map\stores\map.layer.store.ts

import type { MapLayerState } from "@/design-system/components/map/types/map.type";
import { create } from "zustand";

// Clean up any legacy persisted map-layer-store from localStorage
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("map-layer-store");
  } catch {
    // ignore
  }
}

export const useMapLayerStore = create<MapLayerState>((set) => ({
  wmsVisible: true,
  setWmsVisible: (wmsVisible) => set({ wmsVisible }),
  globalOpacity: 1.0,
  setGlobalOpacity: (globalOpacity) => set({ globalOpacity }),
  enabledLayerIds: {},
  layerOpacities: {},
  customLayerConfigs: {},
  toggleLayerId: (layerId) =>
    set((state) => ({
      enabledLayerIds: {
        ...state.enabledLayerIds,
        [layerId]: !state.enabledLayerIds[layerId],
      },
    })),
  setLayerEnabled: (layerId, enabled) =>
    set((state) => ({
      enabledLayerIds: {
        ...state.enabledLayerIds,
        [layerId]: enabled,
      },
    })),
  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layerOpacities: {
        ...state.layerOpacities,
        [layerId]: opacity,
      },
    })),
  setAllLayersEnabled: (layerIds, enabled) =>
    set((state) => {
      const next = { ...state.enabledLayerIds };
      for (const id of layerIds) {
        next[id] = enabled;
      }
      return { enabledLayerIds: next };
    }),
  setCustomLayerConfig: (layerId, config) =>
    set((state) => {
      const next = { ...state.customLayerConfigs };
      if (!config) {
        delete next[layerId];
      } else {
        next[layerId] = config;
      }
      return { customLayerConfigs: next };
    }),
  resetLayers: () =>
    set({
      globalOpacity: 1.0,
      enabledLayerIds: {},
      layerOpacities: {},
      customLayerConfigs: {},
    }),
}));
