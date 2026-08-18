// src/features/mitra/data-request/stores/igt-layer.store.ts

import type { IgtFilterValues } from "@/features/shared/types/filter-igt-trigger.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IgtWfsFilterState = {
  appliedWfsFilters: IgtFilterValues;
  cqlFilter: string | undefined;
  setAppliedWfsFilters: (filters: IgtFilterValues) => void;
};

export const useIgtFilterStore = create<IgtWfsFilterState>()(
  persist(
    (set) => ({
      appliedWfsFilters: {},
      cqlFilter: undefined,
      setAppliedWfsFilters: (appliedWfsFilters) =>
        set({
          appliedWfsFilters,
          cqlFilter: buildIgtCqlFilter(appliedWfsFilters),
        }),
    }),
    {
      name: "igt-filter-store",
    },
  ),
);

/**
 * Combined store hook for backward compatibility across IGT layer concerns.
 */
export const useIgtLayerStore = () => {
  const mapLayerStore = useMapLayerStore();
  const filterStore = useIgtFilterStore();

  return {
    ...mapLayerStore,
    ...filterStore,
  };
};
