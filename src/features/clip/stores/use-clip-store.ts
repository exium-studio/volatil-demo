// src/features/clip/stores/use-clip-store.ts

import { create } from "zustand";
import type { ClipStatus } from "@/features/clip/types/clip.type";
import type GeoJSON from "geojson";

interface ClipStore {
  wmsVisible: boolean;
  clippingPolygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  rawWfsFeatures: GeoJSON.FeatureCollection | null;
  clippedFeatures: GeoJSON.FeatureCollection | null;
  status: ClipStatus;
  error: string | null;

  setWmsVisible: (v: boolean) => void;
  setClippingPolygon: (
    polygon: GeoJSON.Feature<GeoJSON.Polygon> | null,
  ) => void;
  setRawWfsFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setClippedFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setStatus: (s: ClipStatus) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initialState = {
  wmsVisible: true,
  clippingPolygon: null,
  rawWfsFeatures: null,
  clippedFeatures: null,
  status: "idle" as ClipStatus,
  error: null,
};

export const useClipStore = create<ClipStore>((set) => ({
  ...initialState,

  setWmsVisible: (v) => set({ wmsVisible: v }),
  setClippingPolygon: (polygon) => set({ clippingPolygon: polygon }),
  setRawWfsFeatures: (fc) => set({ rawWfsFeatures: fc }),
  setClippedFeatures: (fc) => set({ clippedFeatures: fc }),
  setStatus: (s) => set({ status: s }),
  setError: (e) => set({ error: e }),
  reset: () => set({ ...initialState }),
}));
