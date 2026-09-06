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
      enabledLayerIds: {},
      layerOpacities: {},
      customLayerConfigs: {},
    }),
}));

