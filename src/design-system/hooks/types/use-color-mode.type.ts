export type ColorMode = "light" | "dark";

export type UseColorMode = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};
