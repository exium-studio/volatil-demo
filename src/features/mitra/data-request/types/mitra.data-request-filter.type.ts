// src/features/mitra/data-request/types/mitra.data-request-filter.type.ts

export type FilterOptionItem = {
  label: string;
  value: string;
};

export type FilterOptionsResponse = {
  data: FilterOptionItem[];
};

export type FilterKabupatenParams = {
  provinsiId?: string;
};

export type FilterKecamatanParams = {
  kabupatenId?: string;
};

export type FilterKelurahanParams = {
  kecamatanId?: string;
};

import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

export type AdministrativeFilterState = {
  appliedAdministrativeFilters: FilterAdministrativeAreaValues;
  cqlFilter: string | undefined;
  setAppliedAdministrativeFilters: (
    filters: FilterAdministrativeAreaValues,
  ) => void;
};

export type AdminBoundaryLevel = "provinsi" | "kabupaten" | "kecamatan" | "kelurahan";

export type FetchAdminBoundaryParams = {
  level: AdminBoundaryLevel;
  name: string;
  signal?: AbortSignal;
};


