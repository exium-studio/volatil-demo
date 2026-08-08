import type { IgtThemeItem } from "@/shared/types/common-response.type";

export type MitraDataRequestIgtBasis = "bidang" | "kawasan";

export type MitraDataRequestIgtThemeItem = IgtThemeItem;

export type MitraDataRequestIgtDataItem = {
  id: string;
  basis: MitraDataRequestIgtBasis;
  themes: MitraDataRequestIgtThemeItem[];
  description?: string;
};

// Aliases for compatibility
export type IgtBasis = MitraDataRequestIgtBasis;
export type { IgtThemeItem };
export type IgtDataItem = MitraDataRequestIgtDataItem;
