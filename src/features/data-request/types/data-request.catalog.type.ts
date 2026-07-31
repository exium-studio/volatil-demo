// src/features/data-request/types/data-request.catalog.type.ts

export type IgtThemeType = "bidang" | "kawasan";

export type IgtCategory =
  | "hak_atas_tanah"
  | "pemilikan_tanah"
  | "bidang_tanah"
  | "rtrw_nasional"
  | "rtrw_provinsi"
  | "rtrw_kota";

export interface CatalogItem extends Record<string, unknown> {
  id: string;
  name: string;
  themeType: IgtThemeType;
  quotaBase: number;
  categories: IgtCategory[];
  description: string;
  price: number;
}
