// src/shared/constants/dummy-data/dummy-cart-data.ts

import type { CartItem, CartResponse } from "@/features/cart/types/cart.type";

export const dummyMitraCartItems: CartItem[] = [
  {
    id: "BDG-01",
    name: "Data IGT Bidang 01",
    basis: "bidang",
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
    description: "Data IGT Bidang Hak Atas Tanah",
  },
  {
    id: "KWS-01",
    name: "Data IGT Kawasan 01",
    basis: "kawasan",
    areaInHa: 5000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
    description: "Data IGT Kawasan RTRW Nasional",
  },
  {
    id: "BDG-02",
    name: "Data IGT Bidang 02",
    basis: "bidang",
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
    description: "Data IGT Bidang Pemilikan Tanah",
  },
  {
    id: "KWS-02",
    name: "Data IGT Kawasan 02",
    basis: "kawasan",
    areaInHa: 4000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
    description: "Data IGT Kawasan RTRW Provinsi",
  },
  {
    id: "BDG-03",
    name: "Data IGT Bidang 03",
    basis: "bidang",
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
    description: "Data IGT Bidang Pertanahan",
  },
  {
    id: "KWS-03",
    name: "Data IGT Kawasan 03",
    basis: "kawasan",
    areaInHa: 3000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
    description: "Data IGT Kawasan Tata Ruang",
  },
  {
    id: "BDG-04",
    name: "Data IGT Bidang 04",
    basis: "bidang",
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
    ],
    description: "Data IGT Bidang Wilayah Sleman",
  },
  {
    id: "BDG-05",
    name: "Data IGT Bidang 05",
    basis: "bidang",
    themes: [
      { name: "IGT Sengketa Tanah", description: "Deskripsi Sengketa Tanah" },
    ],
    description: "Data IGT Bidang Sengketa",
  },
  {
    id: "KWS-04",
    name: "Data IGT Kawasan 04",
    basis: "kawasan",
    areaInHa: 5000,
    themes: [
      { name: "IGT Hutan Lindung", description: "Deskripsi Hutan Lindung" },
    ],
    description: "Data IGT Kawasan Hutan Lindung",
  },
  {
    id: "BDG-06",
    name: "Data IGT Bidang 06",
    basis: "bidang",
    themes: [
      { name: "IGT Batas Administrasi", description: "Deskripsi Batas" },
    ],
    description: "Data IGT Bidang Batas Administrasi",
  },
  {
    id: "KWS-05",
    name: "Data IGT Kawasan 05",
    basis: "kawasan",
    areaInHa: 3000,
    themes: [
      { name: "IGT Kawasan Industri", description: "Deskripsi Kawasan" },
    ],
    description: "Data IGT Kawasan Industri Terpadu",
  },
  {
    id: "BDG-07",
    name: "Data IGT Bidang 07",
    basis: "bidang",
    themes: [{ name: "IGT Zona Nilai Tanah", description: "Deskripsi ZNT" }],
    description: "Data IGT Bidang ZNT Kota",
  },
  {
    id: "KWS-06",
    name: "Data IGT Kawasan 06",
    basis: "kawasan",
    areaInHa: 4000,
    themes: [{ name: "IGT Tata Guna Lahan", description: "Deskripsi TGL" }],
    description: "Data IGT Kawasan Tata Guna Lahan",
  },
  {
    id: "BDG-08",
    name: "Data IGT Bidang 08",
    basis: "bidang",
    themes: [{ name: "IGT Hak Guna Bangunan", description: "Deskripsi HGB" }],
    description: "Data IGT Bidang Hak Guna Bangunan",
  },
  {
    id: "KWS-07",
    name: "Data IGT Kawasan 07",
    basis: "kawasan",
    areaInHa: 4000,
    themes: [{ name: "IGT Wilayah Pesisir", description: "Deskripsi Pesisir" }],
    description: "Data IGT Kawasan Wilayah Pesisir",
  },
];

export const dummyMitraCartData: CartResponse = {
  items: dummyMitraCartItems,
  meta: {
    page: 1,
    perPage: 20,
    total: 15,
    totalPages: 1,
    totalBidang: 8,
    totalKawasan: 7,
  },
  summary: {
    totalBidang: 8,
    totalBidangPrice: 60000,
    totalKawasan: 7,
    totalKawasanHa: 28000,
    totalKawasanPrice: 420000000,
    subtotal: 420060000,
    serviceFee: 42006000,
    tax: 50827260,
    grandTotal: 512893260,
  },
  config: {
    minimumBidangCount: 5,
    minimumKawasanHa: 20000,
    pricePerBidang: 7500,
    pricePerKawasanHa: 15000,
    serviceFeeRate: 0.1,
    taxRate: 0.11,
  },
};
