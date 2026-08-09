// src/design-system/components/map/stores/map.wfs-clip.store.ts

import { create } from "zustand";
import type { WfsClipStatus } from "@/design-system/components/map/types/map.wfs-clip.type";
import type GeoJSON from "geojson";

type WfsClipStore = {
  clippingPolygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  rawWfsFeatures: GeoJSON.FeatureCollection | null;
  clippedFeatures: GeoJSON.FeatureCollection | null;
  status: WfsClipStatus;
  error: string | null;

  setClippingPolygon: (
    polygon: GeoJSON.Feature<GeoJSON.Polygon> | null,
  ) => void;
  setRawWfsFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setClippedFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setStatus: (s: WfsClipStatus) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

const initialState = {
  clippingPolygon: null,
  rawWfsFeatures: null,
  clippedFeatures: null,
  status: "idle" as WfsClipStatus,
  error: null,
};

export const useWfsClipStore = create<WfsClipStore>((set) => ({
  ...initialState,

  setClippingPolygon: (polygon) => set({ clippingPolygon: polygon }),
  setRawWfsFeatures: (fc) => set({ rawWfsFeatures: fc }),
  setClippedFeatures: (fc) => set({ clippedFeatures: fc }),
  setStatus: (s) => set({ status: s }),
  setError: (e) => set({ error: e }),
  reset: () => set({ ...initialState }),
}));
