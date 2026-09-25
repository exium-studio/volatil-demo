// src\features\internal\order-review\stores\order-review-layer.store.ts

import type { OrderReviewLayerState } from "@/features/internal/order-review/types/order-review.type";
import { create } from "zustand";

export const useOrderReviewLayerStore = create<OrderReviewLayerState>(
  (set) => ({
    enabledLayerIds: {},
    layerConfigs: {},
    aoiPolygon: null,
    isAoiVisible: false,
    toggleLayer: (layerId, config) =>
      set((state) => {
        const nextEnabled = !state.enabledLayerIds[layerId];
        const nextConfigs = { ...state.layerConfigs };
        if (nextEnabled && config) {
          nextConfigs[layerId] = config;
        } else if (!nextEnabled) {
          delete nextConfigs[layerId];
        }
        return {
          enabledLayerIds: {
            ...state.enabledLayerIds,
            [layerId]: nextEnabled,
          },
          layerConfigs: nextConfigs,
        };
      }),
    setLayerEnabled: (layerId, enabled, config) =>
      set((state) => {
        const nextConfigs = { ...state.layerConfigs };
        if (enabled && config) {
          nextConfigs[layerId] = config;
        } else if (!enabled) {
          delete nextConfigs[layerId];
        }
        return {
          enabledLayerIds: {
            ...state.enabledLayerIds,
            [layerId]: enabled,
          },
          layerConfigs: nextConfigs,
        };
      }),
    setAoiPolygon: (polygon, visible = true) =>
      set({
        aoiPolygon: polygon,
        isAoiVisible: polygon !== null ? visible : false,
      }),
    setAoiVisible: (visible) =>
      set((state) => ({
        isAoiVisible: state.aoiPolygon !== null ? visible : false,
      })),
    resetLayers: () =>
      set({
        enabledLayerIds: {},
        layerConfigs: {},
        aoiPolygon: null,
        isAoiVisible: false,
      }),
  }),
);
