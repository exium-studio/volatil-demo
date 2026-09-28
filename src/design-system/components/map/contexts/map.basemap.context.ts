// src/design-system/components/map/contexts/map.basemap.context.ts

import type { BaseMapContextValue } from "@/design-system/components/map/types/map.basemap.type";
import { createContext, useContext } from "react";

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
