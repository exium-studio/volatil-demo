// src/design-system/stores/layout-store.ts

import type {
  LayoutConfig,
  LayoutStore,
} from "@/design-system/stores/types/layout-store.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "layout-config";

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  maxW: "720px",
};

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUT_CONFIG,
      setLayout: (config) => {
        set((state) => {
          const update =
            typeof config === "function" ? config(state.layout) : config;
          return { layout: { ...state.layout, ...update } };
        });
      },
      setMaxW: (maxW) => {
        set((state) => ({
          layout: { ...state.layout, maxW },
        }));
      },
      resetLayout: () => {
        set({ layout: DEFAULT_LAYOUT_CONFIG });
      },
    }),
    { name: STORAGE_KEY },
  ),
);
