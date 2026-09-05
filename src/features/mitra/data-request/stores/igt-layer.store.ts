// src/features/mitra/data-request/stores/igt-layer.store.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { create } from "zustand";

type AdministrativeFilterState = {
  appliedAdministrativeFilters: FilterAdministrativeAreaValues;
  cqlFilter: string | undefined;
  setAppliedAdministrativeFilters: (
    filters: FilterAdministrativeAreaValues,
  ) => void;
};

export const useAdministrativeFilterStore = create<AdministrativeFilterState>()(
  (set) => ({
    appliedAdministrativeFilters: {},
    cqlFilter: undefined,
    setAppliedAdministrativeFilters: (appliedAdministrativeFilters) =>
      set({
        appliedAdministrativeFilters,
        cqlFilter: buildIgtCqlFilter(appliedAdministrativeFilters),
      }),
  }),
);

/**
 * Combined store hook for backward compatibility across IGT layer concerns.
 */
export const useIgtLayerStore = () => {
  const mapLayerStore = useMapLayerStore();
  const filterStore = useAdministrativeFilterStore();

  return {
    ...mapLayerStore,
    ...filterStore,
  };
};
