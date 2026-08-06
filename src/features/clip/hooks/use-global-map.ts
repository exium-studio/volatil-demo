/* eslint-disable */
// src/features/clip/hooks/use-global-map.ts

import { useState, useEffect } from "react";
import type maplibregl from "maplibre-gl";

/**
 * Accesses the global map instance exposed by BaseMap.
 * This allows the Clip/Data Request feature (which runs in <Outlet /> outside the BaseMap provider)
 * to interact with the map.
 */
export function useGlobalMap() {
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if ((window as any).__map) {
      setMap((window as any).__map as maplibregl.Map);
    } else {
      const interval = setInterval(() => {
        if ((window as any).__map) {
          setMap((window as any).__map as maplibregl.Map);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  return map;
}
