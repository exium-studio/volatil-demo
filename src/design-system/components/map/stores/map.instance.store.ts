// src/design-system/components/map/stores/map.instance.store.ts

import type maplibregl from "maplibre-gl";
import { create } from "zustand";

type MapInstanceState = {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map | null) => void;
};

export const useMapInstanceStore = create<MapInstanceState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
