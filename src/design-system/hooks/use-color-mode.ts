// src/design-system/hooks/use-color-mode.ts

import { useTheme } from "next-themes";

export type ColorMode = "light" | "dark";

export type UseColorMode = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};

export function useColorMode(): UseColorMode {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<TLight, TDark>(
  lightValue: TLight,
  darkValue: TDark,
): TLight | TDark {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? darkValue : lightValue;
}
