// src/shared/constants/dummy-data/dummy-igt-by-aoi.ts

import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { IgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";

export const DUMMY_IGT_ITEMS: IgtDataItem[] = [
  {
    id: "igt-1",
    basis: "bidang",
    themes: [{ name: "RTR" }, { name: "Batas Wilayah" }],
    description: "Data IGT Bidang RTR Kabupaten",
  },
  {
    id: "igt-2",
    basis: "kawasan",
    themes: [{ name: "Pertanahan" }],
    description: "Data IGT Kawasan Pertanahan Provinsi",
  },
];

export const dummyIgtData: IgtDataResponse = {
  items: DUMMY_IGT_ITEMS,
  meta: {
    page: 1,
    perPage: 10,
    total: 2,
    totalPages: 1,
  },
};
