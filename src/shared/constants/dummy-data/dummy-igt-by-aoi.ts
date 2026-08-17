// src/shared/constants/dummy-data/dummy-igt-by-aoi.ts

import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { MitraDataRequestIgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_IGT_ITEMS: MitraDataRequestIgtDataItem[] = [
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
  {
    id: "igt-3",
    basis: "bidang",
    themes: [{ name: "Rencana Tata Ruang" }],
    description: "Data IGT Bidang RTRW Kabupaten Sleman",
  },
  {
    id: "igt-4",
    basis: "bidang",
    themes: [{ name: "Batas Administrasi" }],
    description: "Data IGT Bidang Batas Wilayah Desa",
  },
  {
    id: "igt-5",
    basis: "kawasan",
    themes: [{ name: "Kawasan Hutan" }, { name: "Pertanahan" }],
    description: "Data IGT Kawasan Hutan Lindung",
  },
];

export const dummyIgtData: MitraDataRequestIgtDataResponse = {
  items: DUMMY_IGT_ITEMS,
  pagination: createPaginationMeta(1, 10, 5),
};
