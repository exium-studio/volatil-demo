// src/design-system/stores/types/layout-store.type.ts

export type LayoutConfig = {
  maxW: string | number;
};

export type LayoutStore = {
  layout: LayoutConfig;
  setLayout: (
    config:
      | Partial<LayoutConfig>
      | ((prev: LayoutConfig) => Partial<LayoutConfig>),
  ) => void;
  setMaxW: (maxW: string | number) => void;
  resetLayout: () => void;
};
