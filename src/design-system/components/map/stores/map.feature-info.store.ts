// src/design-system/components/map/stores/map.feature-info.store.ts

import type { MapFeatureInfoState } from "@/design-system/components/map/types/map.feature-info.type";
import { create } from "zustand";

export const useMapFeatureInfoStore = create<MapFeatureInfoState>((set) => ({
  selectedFeature: null,
  isLoading: false,
  error: null,
  setSelectedFeature: (selectedFeature) =>
    set({ selectedFeature, error: null, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearFeatureInfo: () =>
    set({ selectedFeature: null, isLoading: false, error: null }),
}));
