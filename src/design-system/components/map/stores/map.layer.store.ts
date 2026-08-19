// src/design-system/components/map/stores/map.layer.store.ts

import { DEFAULT_ACTIVE_IGT_LAYER_ID } from "@/features/mitra/data-request/constants/igt.config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useMapLayerStore = create<MapLayerState>()(
  persist(
    (set) => ({
      wmsVisible: true,
      setWmsVisible: (wmsVisible) => set({ wmsVisible }),
      enabledLayerIds: {
        [DEFAULT_ACTIVE_IGT_LAYER_ID]: true,
      },
      layerOpacities: {},
      toggleLayerId: (layerId) =>
        set((state) => {
          const current =
            state.enabledLayerIds[layerId] ??
            (layerId === DEFAULT_ACTIVE_IGT_LAYER_ID);
          return {
            enabledLayerIds: {
              ...state.enabledLayerIds,
              [layerId]: !current,
            },
          };
        }),
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
    }),
    {
      name: "map-layer-store",
    },
  ),
);
