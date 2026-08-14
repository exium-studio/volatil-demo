// src/features/mitra/data-request/stores/igt-layer.store.ts

import { create } from "zustand";
import type { WfsLayerConfig } from "@/design-system/components/map/types/map.type";

interface IgtLayerState {
  selectedLayer: WfsLayerConfig | null;
  setSelectedLayer: (layer: WfsLayerConfig | null) => void;
}

export const useIgtLayerStore = create<IgtLayerState>((set) => ({
  selectedLayer: null,
  setSelectedLayer: (selectedLayer) => set({ selectedLayer }),
}));
