// src/features/mitra/data-request/constants/igt.config.ts

export const IGT_FILTER_KEYS_MAP = {
  BASIS: "igt_basis",
  TEMA: "igt_theme",
  PROVINSI: "WADMPR",
  KABUPATEN: "WADMKK",
  KECAMATAN: "WADMKC",
  KELURAHAN: "WADMKD",
} as const;

// Aliases for compatibility
export const WFS_IGT_FILTER_KEYS_MAP = IGT_FILTER_KEYS_MAP;

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

// ---------------------------------------------------------------------------
// Default Active IGT Layer Config
// ---------------------------------------------------------------------------

export const DEFAULT_ACTIVE_IGT_LAYER_ID =
  "testing_workspace:TEST_BIDANG_TANAH";

export const DEFAULT_ACTIVE_IGT_BBOX: [number, number, number, number] = [
  115.134102, -8.685009, 115.183136, -8.622203,
];
