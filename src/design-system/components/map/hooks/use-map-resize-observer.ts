// src/features/map/hooks/use-map-resize-observer.ts

import { useEffect, type RefObject } from "react";
import type maplibregl from "maplibre-gl";

/**
 * Keeps the MapLibre canvas in sync with its container's actual size.
 * MapLibre does not auto-detect container resizes (splitter drag, sidebar
 * collapse/expand, viewport breakpoint switching), so this observes the
 * container element and calls map.resize() on change.
 * Resize calls are throttled to one per animation frame to avoid layout
 * thrashing/stutter while the splitter is being dragged.
 */
export const useMapResizeObserver = (
  map: maplibregl.Map | null,
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!map || !container) return;

    let rafId: number | null = null;

    const resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        map.resize();
        rafId = null;
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [map, containerRef]);
};
