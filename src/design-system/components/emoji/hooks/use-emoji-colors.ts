// src/design-system/components/emoji/hooks/use-emoji-colors.ts

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const useEmojiColors = (colorPalette = "gray") => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const isDark = colorMode === "dark";

  // Light mode uses clean pastel 100-300 background tones with 700-900 facial features.
  // Dark mode uses solid 500-900 tones for high contrast.
  const subtle =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.100`, colorMode)
      : (resolveSemanticColor(`${colorPalette}.100`, colorMode) ??
        "#ffffff")) ?? "#ffffff";

  const muted =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.300`, colorMode)
      : resolveSemanticColor(`${colorPalette}.300`, colorMode)) ?? "#e6e6e6";

  const emphasized =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.400`, colorMode)
      : resolveSemanticColor(`${colorPalette}.400`, colorMode)) ?? "#cccccc";

  const solid =
    (isDark
      ? resolveSemanticColor(`${colorPalette}.700`, colorMode)
      : resolveSemanticColor(`${colorPalette}.700`, colorMode)) ?? "#000000";

  return { subtle, muted, emphasized, solid };
};
