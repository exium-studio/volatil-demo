// src/design-system/hooks/types/use-color-mode.type.ts

export type ColorMode = "light" | "dark";

export type UseColorMode = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};
