// src/design-system/components/map/stores/map.wfs-clip.store.ts

import type {
  WfsClipStatus,
  WfsClipStore,
} from "@/design-system/components/map/types/map.wfs-clip.type";
import { create } from "zustand";

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
