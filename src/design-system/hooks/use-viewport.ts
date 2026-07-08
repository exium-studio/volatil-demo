// src/design-system/hooks/use-viewport.ts

import { useEffect, useRef, useState } from "react";

type Viewport = {
  width: number;
  height: number;
};

type UseViewportOptions = {
  onChange?: (viewport: Viewport) => void;
};

function getViewport(): Viewport {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useViewport(options?: UseViewportOptions) {
  // Props
  const { onChange } = options ?? {};

  // States
  const [viewport, setViewport] = useState<Viewport>(() => getViewport());

  // Refs
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let rafId: number | null = null;

    function handleResize() {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        const nextViewport = getViewport();

        setViewport(nextViewport);
        onChangeRef.current?.(nextViewport);

        rafId = null;
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return viewport;
}
