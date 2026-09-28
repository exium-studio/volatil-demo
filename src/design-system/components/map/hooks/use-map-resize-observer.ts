// src/design-system/components/map/hooks/use-map-resize-observer.ts

import { useEffect, type RefObject } from "react";
import type maplibregl from "maplibre-gl";

/**
 * Keeps the MapLibre canvas in sync with its container's actual size,
 * without flickering during splitter / panel resize.
 *
 * Strategy:
 *  • SHRINK  → container has overflow:hidden, canvas stays at its current
 *              pixel size and is simply cropped. Zero artifact, pixel-perfect.
 *  • GROW    → canvas CSS width/height is stretched to fill the new container
 *              size. No gap, slightly soft but far better than a blank flash.
 *  • ON IDLE → 50 ms after the last resize event, map.resize() is called once
 *              to commit the real WebGL dimensions. CSS overrides are cleared.
 */
export const useMapResizeObserver = (
  map: maplibregl.Map | null,
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!map || !container) return;

    const canvas = map.getCanvas();

    // Ensure shrink-crop works: canvas overflow must be clipped by container.
    container.style.overflow = "hidden";

    let debounceId: ReturnType<typeof setTimeout> | null = null;

    // Last committed size (after a real map.resize()).
    let lastW = container.clientWidth;
    let lastH = container.clientHeight;

    const resizeObserver = new ResizeObserver(() => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;

      const growingW = newW > lastW;
      const growingH = newH > lastH;

      // Only stretch the CSS dimensions when the container is growing.
      // Shrinking is handled for free by overflow:hidden.
      if (growingW) canvas.style.width = `${newW}px`;
      if (growingH) canvas.style.height = `${newH}px`;

      // Debounce the real WebGL resize to once after drag stops.
      if (debounceId !== null) clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        canvas.style.width = "";
        canvas.style.height = "";
        map.resize();
        lastW = container.clientWidth;
        lastH = container.clientHeight;
        debounceId = null;
      }, 50);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (debounceId !== null) clearTimeout(debounceId);
      canvas.style.width = "";
      canvas.style.height = "";
      container.style.overflow = "";
    };
  }, [map, containerRef]);
};
