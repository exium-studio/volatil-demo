// src/features/mitra/data-request/constants/wfs-igt-filter.config.ts

export type WfsIgtFilterOption = {
  label: string;
  value: string;
};

export type WfsIgtFilterField = {
  key: string; // WFS attribute key
  label: string; // UI label
  placeholder: string;
  options?: WfsIgtFilterOption[];
};

export const WFS_IGT_FILTER_FIELDS_LIST: WfsIgtFilterField[] = [
  {
    key: "statbid",
    label: "Basis",
    placeholder: "Pilih Basis",
    options: [
      { label: "Bidang", value: "bidang" },
      { label: "Kawasan", value: "kawasan" },
    ],
  },
  {
    key: "tema",
    label: "Tema IGT",
    placeholder: "Pilih Tema IGT",
  },
  {
    key: "provinsi",
    label: "Provinsi",
    placeholder: "Pilih Provinsi",
  },
  {
    key: "kabupaten",
    label: "Kota / Kabupaten",
    placeholder: "Pilih Kota / Kabupaten",
  },
  {
    key: "kecamatan",
    label: "Kecamatan",
    placeholder: "Pilih Kecamatan",
  },
];
