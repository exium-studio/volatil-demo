// src/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type.ts

export type MitraDataRequestIgtBasis = "bidang" | "kawasan";

export type MitraDataRequestIgtThemeItem = {
  name: string;
};

export type MitraDataRequestIgtDataItem = {
  id: string;
  basis: MitraDataRequestIgtBasis;
  themes: MitraDataRequestIgtThemeItem[];
  description?: string;
};

// Aliases for compatibility
export type IgtBasis = MitraDataRequestIgtBasis;
export type IgtThemeItem = MitraDataRequestIgtThemeItem;
export type IgtDataItem = MitraDataRequestIgtDataItem;
