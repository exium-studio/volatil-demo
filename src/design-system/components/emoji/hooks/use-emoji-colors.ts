// src/design-system/components/emoji/hooks/use-emoji-colors.ts

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const useEmojiColors = (colorPalette = "gray") => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const isDark = colorMode === "dark";

  // In dark mode, scale range 500 - 900 gives solid, rich contrast without looking transparent or washed out.
  const subtle =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.500`, colorMode)
      : resolveSemanticColor(`${colorPalette}.subtle`, colorMode)) ?? "#ffffff";

  const muted =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.600`, colorMode)
      : resolveSemanticColor(`${colorPalette}.muted`, colorMode)) ?? "#e6e6e6";

  const emphasized =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.700`, colorMode)
      : resolveSemanticColor(`${colorPalette}.emphasized`, colorMode)) ??
    "#cccccc";

  const solid =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.900`, colorMode)
      : resolveSemanticColor(`${colorPalette}.solid`, colorMode)) ?? "#000000";

  return { subtle, muted, emphasized, solid };
};
