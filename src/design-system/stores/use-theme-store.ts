// src/design-system/stores/use-theme-store.ts

import { COLOR_PALETTES } from "@/design-system/constants/colors";
import { ROUNDED_PRESETS } from "@/design-system/constants/presets";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "theme-config";

type ThemeStore = {
  colorPalette: string;
  primaryColor: string;
  primaryColorHex: string;
  radii: {
    label: string;
    component: string;
    container: string;
  };
  ambienceColor: boolean;
  // currency: string
};

export const DEFAULT: ThemeStore = {
  colorPalette: COLOR_PALETTES[25].palette,
  primaryColor: `${COLOR_PALETTES[0].palette}.solid`,
  primaryColorHex: COLOR_PALETTES[0].primaryHex,
  radii: ROUNDED_PRESETS[4],
  ambienceColor: false,
};

type ThemeConfigStore = {
  theme: ThemeStore;
  setTheme: (
    config: Partial<ThemeStore> | ((prev: ThemeStore) => Partial<ThemeStore>),
  ) => void;
};

export const useThemeStore = create<ThemeConfigStore>()(
  persist(
    (set) => ({
      theme: DEFAULT,
      setTheme: (config) => {
        set((state) => {
          const update =
            typeof config === "function" ? config(state.theme) : config;
          return { theme: { ...state.theme, ...update } };
        });
      },
    }),
    { name: STORAGE_KEY },
  ),
);
