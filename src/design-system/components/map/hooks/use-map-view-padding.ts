// src/design-system/components/map/hooks/use-map-view-padding.ts

import { useEffect, useRef, type RefObject } from "react";
import type maplibregl from "maplibre-gl";

type MapViewPaddingOptions = {
  /** Ref to the content panel element, used to measure its live width/height. */
  contentPanelRef: RefObject<HTMLDivElement | null>;
  /** Sidebar width in pixels. */
  sidebarPx: number;
  /** True when layout is stacked vertically (mobile). */
  isVertical: boolean;
};

/**
 * Shifts the MapLibre camera's visual center to account for overlaying UI panels
 * (sidebar + content panel), exactly like Google Maps mobile behavior.
 *
 * Uses ResizeObserver on the content panel for real-time tracking during splitter drag:
 * - Continuous drag: duration 0 — instant, pixel-perfect tracking.
 * - Discrete sidebar toggle: duration 250ms — smooth animated transition.
 */
export const useMapViewPadding = (
  map: maplibregl.Map | null,
  options: MapViewPaddingOptions,
) => {
  // Refs
  const prevSidebarPx = useRef<number>(options.sidebarPx);

  // Apply padding imperatively — called both from ResizeObserver and sidebar change effect
  const applyPadding = (
    sidebarPx: number,
    contentPanelPx: number,
    isVertical: boolean,
    duration: number,
  ) => {
    if (!map) return;

    const padding: maplibregl.PaddingOptions = isVertical
      ? {
          // Mobile: sidebar-like header on top, content panel below
          top: sidebarPx,
          bottom: contentPanelPx,
          left: 0,
          right: 0,
        }
      : {
          // Desktop: sidebar on left, content panel occupies left area
          left: sidebarPx + contentPanelPx,
          top: 0,
          right: 0,
          bottom: 0,
        };

    map.easeTo({ padding, duration });
  };

  // ResizeObserver: fires on every splitter drag tick — duration 0, real-time
  useEffect(() => {
    const el = options.contentPanelRef.current;
    if (!map || !el) return;

    const observer = new ResizeObserver(() => {
      const panelPx = options.isVertical ? el.clientHeight : el.clientWidth;
      applyPadding(options.sidebarPx, panelPx, options.isVertical, 1000);
    });

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, options.contentPanelRef, options.isVertical, options.sidebarPx]);

  // Sidebar toggle effect: fires when sidebarPx changes discretely — animate smoothly
  useEffect(() => {
    if (!map) return;

    const el = options.contentPanelRef.current;
    const panelPx = el
      ? options.isVertical
        ? el.clientHeight
        : el.clientWidth
      : 0;

    const sidebarDelta = Math.abs(options.sidebarPx - prevSidebarPx.current);
    const isDicreteToggle = sidebarDelta > 10;
    const duration = isDicreteToggle ? 250 : 0;

    applyPadding(options.sidebarPx, panelPx, options.isVertical, duration);
    prevSidebarPx.current = options.sidebarPx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, options.sidebarPx, options.isVertical]);
};
