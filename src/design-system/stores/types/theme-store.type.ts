// src/design-system/stores/types/theme-store.type.ts

export type ThemeStore = {
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

export type ThemeConfigStore = {
  theme: ThemeStore;
  setTheme: (
    config: Partial<ThemeStore> | ((prev: ThemeStore) => Partial<ThemeStore>),
  ) => void;
};
