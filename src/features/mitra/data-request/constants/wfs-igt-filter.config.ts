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

export const WFS_IGT_FILTER_CONFIG = {
  [WFS_IGT_FILTER_KEYS_MAP.BASIS]: {
    key: WFS_IGT_FILTER_KEYS_MAP.BASIS,
    label: "Basis IGT",
    placeholder: "Pilih Basis IGT",
  },
  [WFS_IGT_FILTER_KEYS_MAP.TEMA]: {
    key: WFS_IGT_FILTER_KEYS_MAP.TEMA,
    label: "Tema IGT",
    placeholder: "Pilih Tema IGT",
  },
  [WFS_IGT_FILTER_KEYS_MAP.PROVINSI]: {
    key: WFS_IGT_FILTER_KEYS_MAP.PROVINSI,
    label: "Provinsi",
    placeholder: "Pilih Provinsi",
  },
  [WFS_IGT_FILTER_KEYS_MAP.KABUPATEN]: {
    key: WFS_IGT_FILTER_KEYS_MAP.KABUPATEN,
    label: "Kota / Kabupaten",
    placeholder: "Pilih Kota / Kabupaten",
  },
  [WFS_IGT_FILTER_KEYS_MAP.KECAMATAN]: {
    key: WFS_IGT_FILTER_KEYS_MAP.KECAMATAN,
    label: "Kecamatan",
    placeholder: "Pilih Kecamatan",
  },
} as const;
