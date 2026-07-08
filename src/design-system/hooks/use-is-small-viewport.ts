// src/design-system/hooks/use-is-small-viewport.ts

import { SM_SCREEN_BREAKPOINT } from "@/design-system/constants/styles";
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
      onChange?.(viewport.width < parseInt(SM_SCREEN_BREAKPOINT));
    },
  });

  return viewport.width < parseInt(SM_SCREEN_BREAKPOINT);
}
