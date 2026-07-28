// src/design-system/components/map/contexts/map.basemap.context.ts

import type maplibregl from "maplibre-gl";
import { createContext, useContext } from "react";

export type BaseMapContextValue = {
  map: maplibregl.Map | null;
};

export const BaseMapContext = createContext<BaseMapContextValue | null>(null);

export function useBaseMapContext() {
  const context = useContext(BaseMapContext);

  if (!context) {
    throw new Error(
      "useBaseMapContext must be used within BaseMapContextProvider",
    );
  }

  return context;
}
