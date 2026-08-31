// src/design-system/components/map/stores/map.layer.store.ts

import { create } from "zustand";

export type MapLayerState = {
  /** Whether the WMS raster overlay is visible on the map. */
  wmsVisible: boolean;
  setWmsVisible: (visible: boolean) => void;
  enabledLayerIds: Record<string, boolean>;
  layerOpacities: Record<string, number>;
  toggleLayerId: (layerId: string) => void;
  setLayerEnabled: (layerId: string, enabled: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
};

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
}));
