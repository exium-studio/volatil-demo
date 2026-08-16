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
