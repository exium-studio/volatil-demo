// src/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type.ts

export type IgtBasis = "bidang" | "kawasan";

export type IgtThemeItem = {
  name: string;
};

export type IgtDataItem = {
  id: string;
  basis: IgtBasis;
  themes: IgtThemeItem[];
  description?: string;
};

export type MitraDataRequestIgtDataItem = IgtDataItem;
