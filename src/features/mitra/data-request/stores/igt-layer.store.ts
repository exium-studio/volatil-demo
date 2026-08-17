// src/features/mitra/data-request/stores/igt-layer.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";

export type IgtLayerState = {
  enabledLayerIds: Record<string, boolean>;
  toggleLayerId: (layerId: string) => void;
  setLayerEnabled: (layerId: string, enabled: boolean) => void;
  appliedWfsFilters: IgtFilterValues;
  cqlFilter: string | undefined;
  setAppliedWfsFilters: (filters: IgtFilterValues) => void;
};

export const useIgtLayerStore = create<IgtLayerState>()(
  persist(
    (set) => ({
      enabledLayerIds: {},
      toggleLayerId: (layerId) =>
        set((state) => {
          const current = state.enabledLayerIds[layerId] ?? true;
          return {
            enabledLayerIds: {
              ...state.enabledLayerIds,
              [layerId]: !current,
            },
          };
        }),
      setLayerEnabled: (layerId, enabled) =>
        set((state) => ({
          enabledLayerIds: {
            ...state.enabledLayerIds,
            [layerId]: enabled,
          },
        })),
      appliedWfsFilters: {},
      cqlFilter: undefined,
      setAppliedWfsFilters: (appliedWfsFilters) =>
        set({
          appliedWfsFilters,
          cqlFilter: buildIgtCqlFilter(appliedWfsFilters),
        }),
    }),
    {
      name: "igt-layer-store",
    },
  ),
);
