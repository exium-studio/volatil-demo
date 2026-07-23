// src/features/map/store/map-interaction.store.ts

import { create } from "zustand";

interface MapInteractionStore {
  /** Whether map rotation (drag-rotate / touch-rotate) is locked. Free (false) by default. */
  isRotationLocked: boolean;
  toggleRotationLock: () => void;
  setRotationLocked: (locked: boolean) => void;
}

export const useMapInteractionStore = create<MapInteractionStore>((set) => ({
  isRotationLocked: false,
  toggleRotationLock: () =>
    set((state) => ({ isRotationLocked: !state.isRotationLocked })),
  setRotationLocked: (locked) => set({ isRotationLocked: locked }),
}));
