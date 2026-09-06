// src/design-system/stores/theme-store.ts

import { COLOR_PALETTES_LIST } from "@/design-system/constants/colors";
import { ROUNDED_PRESETS_LIST } from "@/design-system/constants/presets";
import type {
  ThemeConfigStore,
  ThemeStore,
} from "@/design-system/stores/types/theme-store.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "theme-config";

export const DEFAULT: ThemeStore = {
  colorPalette: COLOR_PALETTES_LIST[21].palette,
  primaryColor: `${COLOR_PALETTES_LIST[0].palette}.solid`,
  primaryColorHex: COLOR_PALETTES_LIST[0].primaryHex,
  radii: ROUNDED_PRESETS_LIST[4],
  ambienceColor: false,
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
