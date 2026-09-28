// src/design-system/hooks/use-is-small-viewport.ts

import type { UseIsSmallViewportOptions } from "@/design-system/hooks/types/use-is-small-viewport.type";
import { useViewport } from "@/design-system/hooks/use-viewport";

export function useIsSmallViewport(options?: UseIsSmallViewportOptions) {
  // Props
  const { onChange } = options ?? {};

  // Hooks
  const viewport = useViewport({
    onChange(viewport) {
      onChange?.(viewport.width < parseInt("720px"));
    },
  });

  return viewport.width < parseInt("720px");
}
