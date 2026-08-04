// src/features/data-request/types/data-request.type.ts

import type { PaginatedResponse } from "@/shared/types/response.type";

// Data Responses
export type IgtDataResponse = PaginatedResponse<Igt>;

export type Igt = Record<string, unknown> & {
  id: string;
  name: string;
  themeType: IgtThemeType;
  quotaBase: number;
  categories: IgtCategory[];
  description: string;
  price: number;
};

export type IgtCategory =
  | "hak_atas_tanah"
  | "pemilikan_tanah"
  | "bidang_tanah"
  | "rtrw_nasional"
  | "rtrw_provinsi"
  | "rtrw_kota";

// Types
export type IgtThemeType = "bidang" | "kawasan";
