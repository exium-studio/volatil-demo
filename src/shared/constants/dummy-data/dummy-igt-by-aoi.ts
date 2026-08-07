// src/shared/constants/dummy-data/dummy-igt-by-aoi.ts

import type { IgtDataResponse } from "@/features/mitra/data-request/types/data-request.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/igt-by-aoi.type";

export const DUMMY_IGT_ITEMS: IgtDataItem[] = [
  {
    id: "BID-001",
    basis: "bidang",
    themes: [
      {
        name: "Hak Atas Tanah",
        description: "Dokumen kepemilikan lahan bidang",
      },
      { name: "Pemilikan Tanah", description: null },
    ],
    description: "Bidang tanah aktif di kawasan perumahan Kuta Selatan",
  },
  {
    id: "BID-002",
    basis: "bidang",
    themes: [
      {
        name: "Bidang Tanah",
        description: "Data geometri bidang tanah terdaftar",
      },
    ],
    description: null,
  },
  {
    id: "BID-003",
    basis: "bidang",
    themes: [
      { name: "Hak Atas Tanah", description: null },
      { name: "Pemilikan Tanah", description: "Kepemilikan individu" },
      { name: "Bidang Tanah", description: null },
    ],
    description: "Bidang tanah di wilayah Seminyak dengan 3 tema IGT terdaftar",
  },
  {
    id: "BID-004",
    basis: "bidang",
    themes: [{ name: "Hak Atas Tanah", description: null }],
    description: "Bidang tanah komersial di Kuta Utara",
  },
  {
    id: "KAW-001",
    basis: "kawasan",
    themes: [
      {
        name: "RTRW Nasional",
        description: "Rencana tata ruang tingkat nasional",
      },
      {
        name: "RTRW Provinsi",
        description: "Rencana tata ruang Provinsi Bali",
      },
    ],
    description: "Kawasan strategis nasional di pesisir selatan Bali",
  },
  {
    id: "KAW-002",
    basis: "kawasan",
    themes: [
      { name: "RTRW Kota", description: "Rencana tata ruang Kota Denpasar" },
    ],
    description: null,
  },
  {
    id: "BID-005",
    basis: "bidang",
    themes: [
      { name: "Hak Atas Tanah", description: null },
      { name: "Bidang Tanah", description: "Bidang dengan status sengketa" },
    ],
    description: "Bidang tanah dalam proses sengketa administratif",
  },
  {
    id: "KAW-003",
    basis: "kawasan",
    themes: [
      { name: "RTRW Nasional", description: null },
      { name: "RTRW Provinsi", description: null },
      { name: "RTRW Kota", description: "Overlay tiga level tata ruang" },
    ],
    description: "Kawasan pariwisata prioritas dengan overlay tiga level RTRW",
  },
  {
    id: "BID-006",
    basis: "bidang",
    themes: [{ name: "Pemilikan Tanah", description: null }],
    description: null,
  },
  {
    id: "BID-007",
    basis: "bidang",
    themes: [
      { name: "Hak Atas Tanah", description: "Hak milik perorangan" },
      { name: "Pemilikan Tanah", description: null },
      { name: "Bidang Tanah", description: null },
    ],
    description: "Bidang tanah perumahan di Jimbaran",
  },
  {
    id: "KAW-004",
    basis: "kawasan",
    themes: [
      { name: "RTRW Provinsi", description: "Kawasan hijau provinsi Bali" },
    ],
    description: "Kawasan konservasi mangrove pantai selatan",
  },
  {
    id: "BID-008",
    basis: "bidang",
    themes: [{ name: "Hak Atas Tanah", description: null }],
    description: "Lahan kosong di Nusa Dua belum terbangun",
  },
  {
    id: "BID-009",
    basis: "bidang",
    themes: [
      { name: "Bidang Tanah", description: null },
      { name: "Pemilikan Tanah", description: "Kepemilikan badan hukum" },
    ],
    description: null,
  },
  {
    id: "KAW-005",
    basis: "kawasan",
    themes: [
      { name: "RTRW Nasional", description: null },
      { name: "RTRW Kota", description: null },
    ],
    description: "Kawasan industri terpadu Denpasar Utara",
  },
  {
    id: "BID-010",
    basis: "bidang",
    themes: [{ name: "Hak Atas Tanah", description: "Hak guna bangunan" }],
    description: "Bidang tanah komersial ritel Kuta",
  },
  {
    id: "KAW-006",
    basis: "kawasan",
    themes: [
      { name: "RTRW Provinsi", description: "Zona penyangga" },
      { name: "RTRW Kota", description: null },
    ],
    description: null,
  },
  {
    id: "BID-011",
    basis: "bidang",
    themes: [
      { name: "Hak Atas Tanah", description: null },
      { name: "Pemilikan Tanah", description: null },
      { name: "Bidang Tanah", description: "Bidang aktif terdaftar" },
    ],
    description: "Bidang tanah perkebunan Tabanan",
  },
  {
    id: "KAW-007",
    basis: "kawasan",
    themes: [
      {
        name: "RTRW Nasional",
        description: "Kawasan strategis nasional pantai",
      },
    ],
    description: "Kawasan pesisir dengan perlindungan zona nasional",
  },
  {
    id: "BID-012",
    basis: "bidang",
    themes: [{ name: "Pemilikan Tanah", description: null }],
    description: null,
  },
  {
    id: "KAW-008",
    basis: "kawasan",
    themes: [
      { name: "RTRW Nasional", description: null },
      { name: "RTRW Provinsi", description: "Kawasan agrowisata Bali" },
      { name: "RTRW Kota", description: "Zona agro kota Bangli" },
    ],
    description: "Kawasan agrowisata dengan tiga level perencanaan tata ruang",
  },
];

export const dummyIgtData: IgtDataResponse = {
  items: DUMMY_IGT_ITEMS,
  meta: {
    page: 1,
    perPage: 10,
    total: DUMMY_IGT_ITEMS.length,
    totalPages: 1,
  },
};
