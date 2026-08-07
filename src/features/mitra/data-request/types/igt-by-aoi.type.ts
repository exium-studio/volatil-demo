// src/features/mitra/data-request/types/igt-by-aoi.type.ts

export type IgtTheme = {
  name: string;
  description: string | null;
};

export type IgtDataItem = {
  id: string;
  themes: IgtTheme[];
  basis: "bidang" | "kawasan";
  description: string | null;
};
