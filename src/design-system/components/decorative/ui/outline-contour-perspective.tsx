// src/design-system/components/decorative/ui/outline-contour-perspective.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { OutlineContourPerspectiveProps } from "@/design-system/components/decorative/type/outline-contour-perspective.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useMemo } from "react";

const SVG_URL = "/assets/svgs/decorative/outline-contour-perspective.svg";

export const OutlineContourPerspective = (
  props: OutlineContourPerspectiveProps,
) => {
  // Props
  const { color, ...restProps } = props;

  // Stores
  const { colorMode } = useColorMode();
  const { theme } = useThemeStore();

  // Derived Values
  const resolvedColor = useMemo(() => {
    if (color) return color;
    if (theme.colorPalette === "gray") {
      return colorMode === "dark" ? "#ffffff" : "#1b1b1b";
    }
    return (
      resolveSemanticColor(`${theme.colorPalette}.fg`, colorMode) || "#888888"
    );
  }, [color, theme.colorPalette, colorMode]);

  return (
    <Box
      role={"presentation"}
      pointerEvents={"none"}
      bg={resolvedColor}
      css={{
        maskImage: `url(${SVG_URL})`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: `url(${SVG_URL})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
      {...restProps}
    />
  );
};
