// src/features/mitra/data-request/constants/wfs-igt-filter.config.ts

export const WFS_IGT_FILTER_KEYS_MAP = {
  BASIS: "basis",
  TEMA: "tema",
  PROVINSI: "provinsi",
  KABUPATEN: "kabupaten",
  KECAMATAN: "kecamatan",
} as const;

export type WfsIgtFilterKey =
  (typeof WFS_IGT_FILTER_KEYS_MAP)[keyof typeof WFS_IGT_FILTER_KEYS_MAP];
