// src/features/mitra/data-request/constants/igt.config.ts

export const IGT_FILTER_KEYS_MAP = {
  BASIS: "igt_basis",
  TEMA: "igt_theme",
  PROVINSI: "WADMPR",
  KABUPATEN: "WADMKK",
  KECAMATAN: "WADMKC",
  KELURAHAN: "WADMKD",
} as const;

export type IgtFilterKey =
  (typeof IGT_FILTER_KEYS_MAP)[keyof typeof IGT_FILTER_KEYS_MAP];

// Aliases for compatibility
export const WFS_IGT_FILTER_KEYS_MAP = IGT_FILTER_KEYS_MAP;
export type WfsIgtFilterKey = IgtFilterKey;

export const IGT_AREA_KEYS = [
  "luas",
  "luas_ha",
  "luasha",
  "luas_m2",
  "luasm2",
  "shape_area",
  "st_area",
  "area",
] as const;

export type IgtAreaKey = (typeof IGT_AREA_KEYS)[number];
