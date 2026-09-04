import type { WmsRasterLayerConfig } from "@/design-system/components/map/types/map.type";
import { create } from "zustand";

export type MapLayerState = {
  /** Whether the WMS raster overlay is visible on the map. */
  wmsVisible: boolean;
  setWmsVisible: (visible: boolean) => void;
  enabledLayerIds: Record<string, boolean>;
  layerOpacities: Record<string, number>;
  customLayerConfigs: Record<string, Partial<WmsRasterLayerConfig>>;
  toggleLayerId: (layerId: string) => void;
  setLayerEnabled: (layerId: string, enabled: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setCustomLayerConfig: (
    layerId: string,
    config: Partial<WmsRasterLayerConfig> | null,
  ) => void;
  resetLayers: () => void;
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

