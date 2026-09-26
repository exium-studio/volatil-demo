// src/design-system/components/emoji/hooks/use-emoji-colors.ts

// src\design-system\components\emoji\hooks\use-emoji-colors.ts

// src\design-system\components\emoji\hooks\use-emoji-colors.ts

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const useEmojiColors = (colorPalette = "gray") => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const isDark = colorMode === "dark";
  const isNeutral = colorPalette === "neutral" || !colorPalette;

  // Light mode uses clean pastel 100-300 background tones with 700-900 facial features.
  // Dark mode for neutral uses overall darker face (600-700) with deep solid facial features (950).
  // Dark mode for colored palettes uses vibrant 500-800 tones.
  const subtle =
    (isNeutral
      ? isDark
        ? resolveSemanticColor("neutral.500", colorMode)
        : resolveSemanticColor("neutral.100", colorMode)
      : isDark
        ? resolveSemanticColor(`${colorPalette}.200`, colorMode)
        : resolveSemanticColor(`${colorPalette}.100`, colorMode)) ?? "#ffffff";

  const muted =
    (isNeutral
      ? isDark
        ? resolveSemanticColor("neutral.600", colorMode)
        : resolveSemanticColor("neutral.300", colorMode)
      : isDark
        ? resolveSemanticColor(`${colorPalette}.400`, colorMode)
        : resolveSemanticColor(`${colorPalette}.300`, colorMode)) ?? "#e6e6e6";

  const emphasized =
    (isNeutral
      ? isDark
        ? resolveSemanticColor("neutral.700", colorMode)
        : resolveSemanticColor("neutral.400", colorMode)
      : isDark
        ? resolveSemanticColor(`${colorPalette}.500`, colorMode)
        : resolveSemanticColor(`${colorPalette}.400`, colorMode)) ?? "#cccccc";

  const solid =
    (isNeutral
      ? isDark
        ? resolveSemanticColor("neutral.950", colorMode)
        : resolveSemanticColor("neutral.700", colorMode)
      : isDark
        ? resolveSemanticColor(`${colorPalette}.800`, colorMode)
        : resolveSemanticColor(`${colorPalette}.700`, colorMode)) ?? "#000000";

  return { subtle, muted, emphasized, solid };
};
