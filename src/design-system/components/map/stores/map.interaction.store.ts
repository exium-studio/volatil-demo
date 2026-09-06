// src/design-system/components/map/stores/map.interaction.store.ts

import type { MapInteractionStore } from "@/design-system/components/map/types/map.type";
import { create } from "zustand";

export const useMapInteractionStore = create<MapInteractionStore>((set) => ({
  isRotationLocked: false,
  toggleRotationLock: () =>
    set((state) => ({ isRotationLocked: !state.isRotationLocked })),
  setRotationLocked: (locked) => set({ isRotationLocked: locked }),
}));
