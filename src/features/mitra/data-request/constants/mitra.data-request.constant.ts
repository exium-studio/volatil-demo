// src/features/mitra/data-request/constants/mitra.data-request.constant.ts

export const WFS_BIDANG_ATTRIBUTES = [
  "id",
  "kodewilaya",
  "kabupaten",
  "kecamatan",
  "kelurahan",
  "tipehak",
  "nib",
  "luastertul",
  "statbid",
] as const;

export const WFS_BIDANG_ATTRIBUTE_LABELS: Record<
  (typeof WFS_BIDANG_ATTRIBUTES)[number],
  string
> = {
  id: "ID Bidang",
  kodewilaya: "Kode Wilayah",
  kabupaten: "Kabupaten",
  kecamatan: "Kecamatan",
  kelurahan: "Kelurahan",
  tipehak: "Tipe Hak",
  nib: "NIB",
  luastertul: "Luas Tertulis (m²)",
  statbid: "Status Bidang",
};
