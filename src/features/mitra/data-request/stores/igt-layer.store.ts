// src/features/mitra/data-request/stores/igt-layer.store.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { useMitraDataRequestStore } from "@/features/mitra/data-request/stores/mitra.data-request.store";

export const useAdministrativeFilterStore = () => {
  const appliedAdministrativeFilters = useMitraDataRequestStore(
    (state) => state.appliedAdministrativeFilters,
  );
  const cqlFilter = useMitraDataRequestStore((state) => state.cqlFilter);
  const setAppliedAdministrativeFilters = useMitraDataRequestStore(
    (state) => state.setAppliedAdministrativeFilters,
  );

  return {
    appliedAdministrativeFilters,
    cqlFilter,
    setAppliedAdministrativeFilters,
  };
};

useAdministrativeFilterStore.getState = () => ({
  appliedAdministrativeFilters:
    useMitraDataRequestStore.getState().appliedAdministrativeFilters,
  cqlFilter: useMitraDataRequestStore.getState().cqlFilter,
  setAppliedAdministrativeFilters:
    useMitraDataRequestStore.getState().setAppliedAdministrativeFilters,
});

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
