// src/shared/constants/dummy-data/dummy-cart-data.ts

import {
  MINIMUM_BIDANG_COUNT,
  MINIMUM_KAWASAN_HA,
  PRICE_PER_BIDANG,
  PRICE_PER_KAWASAN_HA,
} from "@/features/cart/constants/cart.config";
import type { CartItem, CartResponse } from "@/features/cart/types/cart.type";

export const DUMMY_CART_ITEMS: CartItem[] = [
  {
    id: "AOI-01",
    name: "AOI - 01",
    basis: "bidang",
    quota: 1000,
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
  },
  {
    id: "AOI-02",
    name: "AOI - 02",
    basis: "kawasan",
    quota: 1000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
  },
  {
    id: "AOI-03",
    name: "AOI - 03",
    basis: "bidang",
    quota: 1000,
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
  },
  {
    id: "AOI-04",
    name: "AOI - 04",
    basis: "kawasan",
    quota: 1000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
  },
  {
    id: "AOI-05",
    name: "AOI - 05",
    basis: "bidang",
    quota: 500,
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
      { name: "IGT Pemilikan Tanah", description: "Deskripsi Pemilikan Tanah" },
    ],
  },
  {
    id: "AOI-06",
    name: "AOI - 06",
    basis: "kawasan",
    quota: 1000,
    themes: [
      { name: "IGT RTRW Nasional", description: "Deskripsi RTRW Nasional" },
      { name: "IGT RTRW Provinsi", description: "Deskripsi RTRW Provinsi" },
    ],
  },
  {
    id: "AOI-07",
    name: "AOI - 07",
    basis: "bidang",
    quota: 1000,
    themes: [
      { name: "IGT Hak Atas Tanah", description: "Deskripsi Hak Atas Tanah" },
    ],
  },
  {
    id: "AOI-08",
    name: "AOI - 08",
    basis: "bidang",
    quota: 750,
    themes: [
      { name: "IGT Sengketa Tanah", description: "Deskripsi Sengketa Tanah" },
    ],
  },
  {
    id: "AOI-09",
    name: "AOI - 09",
    basis: "kawasan",
    quota: 1200,
    themes: [
      { name: "IGT Hutan Lindung", description: "Deskripsi Hutan Lindung" },
    ],
  },
  {
    id: "AOI-10",
    name: "AOI - 10",
    basis: "bidang",
    quota: 300,
    themes: [
      { name: "IGT Batas Administrasi", description: "Deskripsi Batas" },
    ],
  },
  {
    id: "AOI-11",
    name: "AOI - 11",
    basis: "kawasan",
    quota: 800,
    themes: [
      { name: "IGT Kawasan Industri", description: "Deskripsi Kawasan" },
    ],
  },
  {
    id: "AOI-12",
    name: "AOI - 12",
    basis: "bidang",
    quota: 1500,
    themes: [
      { name: "IGT Zona Nilai Tanah", description: "Deskripsi ZNT" },
    ],
  },
  {
    id: "AOI-13",
    name: "AOI - 13",
    basis: "kawasan",
    quota: 500,
    themes: [
      { name: "IGT Tata Guna Lahan", description: "Deskripsi TGL" },
    ],
  },
  {
    id: "AOI-14",
    name: "AOI - 14",
    basis: "bidang",
    quota: 600,
    themes: [
      { name: "IGT Hak Guna Bangunan", description: "Deskripsi HGB" },
    ],
  },
  {
    id: "AOI-15",
    name: "AOI - 15",
    basis: "kawasan",
    quota: 1500,
    themes: [
      { name: "IGT Wilayah Pesisir", description: "Deskripsi Pesisir" },
    ],
  },
];

const totalBidangCount = DUMMY_CART_ITEMS.filter(
  (item) => item.basis === "bidang",
).reduce((sum, item) => sum + item.quota, 0);

const totalKawasanHaCount = DUMMY_CART_ITEMS.filter(
  (item) => item.basis === "kawasan",
).reduce((sum, item) => sum + item.quota, 0);

const totalBidangPrice = totalBidangCount * PRICE_PER_BIDANG;
const totalKawasanPrice = totalKawasanHaCount * PRICE_PER_KAWASAN_HA;
const subtotal = totalBidangPrice + totalKawasanPrice;
const serviceFee = Math.round(subtotal * 0.1);
const tax = Math.round((subtotal + serviceFee) * 0.11);
const grandTotal = subtotal + serviceFee + tax;

export const DUMMY_CART_RESPONSE: CartResponse = {
  items: DUMMY_CART_ITEMS,
  meta: {
    page: 1,
    perPage: 20,
    total: DUMMY_CART_ITEMS.length,
    totalPages: 1,
    totalBidang: totalBidangCount,
    totalKawasan: totalKawasanHaCount,
  },
  summary: {
    totalBidang: totalBidangCount,
    totalBidangPrice,
    totalKawasan: DUMMY_CART_ITEMS.filter((i) => i.basis === "kawasan").length,
    totalKawasanHa: totalKawasanHaCount,
    totalKawasanPrice,
    subtotal,
    serviceFee,
    tax,
    grandTotal,
  },
};
