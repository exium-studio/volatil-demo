// src/design-system/components/map/hooks/use-map-view-padding.ts

import type { MapViewPaddingOptions } from "@/design-system/components/map/types/map.type";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

/**
 * Shifts the MapLibre camera's visual center to account for overlaying UI panels
 * (sidebar + content panel), exactly like Google Maps mobile behavior.
 *
 * Uses ResizeObserver on the content panel for real-time tracking during splitter drag:
 * - Continuous drag: duration 0 — instant, direct map.setPadding tracking.
 * - Discrete sidebar toggle / double click reset: duration > 0 — smooth animated transition via map.easeTo.
 */
export const useMapViewPadding = (
  map: maplibregl.Map | null,
  options: MapViewPaddingOptions,
) => {
  // Refs
  const prevSidebarPx = useRef<number>(options.sidebarPx);
  const prevPanelPx = useRef<number>(0);

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

    if (duration === 0) {
      map.setPadding(padding);
    } else {
      map.easeTo({ padding, duration, essential: true });
    }
  };

  // ResizeObserver: fires on every splitter drag tick and initial mount
  useEffect(() => {
    const el = options.contentPanelRef.current;
    if (!map || !el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const panelPx = entry
        ? options.isVertical
          ? entry.contentRect.height
          : entry.contentRect.width
        : options.isVertical
          ? el.clientHeight
          : el.clientWidth;

      if (panelPx <= 0) return;

      const panelDelta = Math.abs(panelPx - prevPanelPx.current);
      // First calculation is instant, large jump (reset layout) is animated, drag is instant
      const duration = prevPanelPx.current === 0 ? 0 : panelDelta > 100 ? 300 : 0;
      applyPadding(options.sidebarPx, panelPx, options.isVertical, duration);
      prevPanelPx.current = panelPx;
    });

    observer.observe(el);

    const initialPx = options.isVertical ? el.clientHeight : el.clientWidth;
    if (initialPx > 0) {
      applyPadding(options.sidebarPx, initialPx, options.isVertical, 0);
      prevPanelPx.current = initialPx;
    }

    return () => {
      observer.disconnect();
    };
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
      : prevPanelPx.current ||
        (typeof window !== "undefined"
          ? options.isVertical
            ? window.innerHeight * 0.5
            : (window.innerWidth - options.sidebarPx) * 0.5
          : 0);

    const sidebarDelta = Math.abs(options.sidebarPx - prevSidebarPx.current);
    const isDiscreteToggle = sidebarDelta > 10;
    const duration = isDiscreteToggle ? 250 : 0;

    applyPadding(options.sidebarPx, panelPx, options.isVertical, duration);
    prevSidebarPx.current = options.sidebarPx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, options.sidebarPx, options.isVertical]);
};
