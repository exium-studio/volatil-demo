// src/design-system/components/data-display/contexts/data-view-table.context.ts

import type { DataViewTableContextValue } from "@/design-system/components/data-display/types/data-view-table.type";
import { createContext, useContext } from "react";

export const DataViewTableContext =
  createContext<DataViewTableContextValue | null>(null);

export const useDataViewTableContext = () => {
  const ctx = useContext(DataViewTableContext);
  if (!ctx) {
    throw new Error(
      "DataViewTable compound components must be used within <DataViewTable.Root>",
    );
  }
  return ctx;
};
