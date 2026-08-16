// src/features/mitra/data-request/constants/igt-filter.config.ts

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
