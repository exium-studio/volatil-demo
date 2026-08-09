// src/features/mitra/data-request/constants/mitra.data-request.constant.ts

export const WFS_BIDANG_ATTRIBUTE_MAP = {
  id: "ID Bidang",
  kodewilaya: "Kode Wilayah",
  kabupaten: "Kabupaten",
  kecamatan: "Kecamatan",
  kelurahan: "Kelurahan",
  tipehak: "Tipe Hak",
  nib: "NIB",
  luastertul: "Luas Tertulis (m²)",
  statbid: "Status Bidang",
} as const;

export type WfsBidangAttributeKey = keyof typeof WFS_BIDANG_ATTRIBUTE_MAP;

export const WFS_BIDANG_ATTRIBUTES = Object.keys(
  WFS_BIDANG_ATTRIBUTE_MAP,
) as WfsBidangAttributeKey[];
