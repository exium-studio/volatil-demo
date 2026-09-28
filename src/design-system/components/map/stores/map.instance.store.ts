// src/design-system/components/map/stores/map.instance.store.ts

import type { MapInstanceState } from "@/design-system/components/map/types/map.type";
import { create } from "zustand";

export const useMapInstanceStore = create<MapInstanceState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
