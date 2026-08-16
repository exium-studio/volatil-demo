// src/features/mitra/data-request/constants/wfs-igt-filter.config.ts

export const WFS_IGT_FILTER_KEYS_MAP = {
  BASIS: "igt_basis",
  TEMA: "igt_theme",
  PROVINSI: "WADMPR",
  KABUPATEN: "WADMKK",
  KECAMATAN: "WADMKC",
  KELURAHAN: "WADMKD",
} as const;

export type WfsIgtFilterKey =
  (typeof WFS_IGT_FILTER_KEYS_MAP)[keyof typeof WFS_IGT_FILTER_KEYS_MAP];
