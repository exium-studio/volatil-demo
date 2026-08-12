// src/design-system/hooks/use-is-small-viewport.ts

import { DIMENSIONS } from "@/design-system/constants/styles";
import { useViewport } from "@/design-system/hooks/use-viewport";

type UseIsSmallViewportOptions = {
  onChange?: (isSmallViewport: boolean) => void;
};

export function useIsSmallViewport(options?: UseIsSmallViewportOptions) {
  // Props
  const { onChange } = options ?? {};

  // Hooks
  const viewport = useViewport({
    onChange(viewport) {
      onChange?.(viewport.width < parseInt(DIMENSIONS.smScreenBreakpoint));
    },
  });

  return viewport.width < parseInt(DIMENSIONS.smScreenBreakpoint);
}
