// src/design-system/hooks/use-is-small-viewport.ts

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
      onChange?.(viewport.width < parseInt("720px"));
    },
  });

  return viewport.width < parseInt("720px");
}
