// src/design-system/components/map/stores/map.layer.store.ts

import { create } from "zustand";

interface MapLayerStore {
  /** Whether the WMS raster overlay is visible on the map. */
  wmsVisible: boolean;
  setWmsVisible: (visible: boolean) => void;
}

export const useMapLayerStore = create<MapLayerStore>((set) => ({
  wmsVisible: true,
  setWmsVisible: (wmsVisible) => set({ wmsVisible }),
}));
