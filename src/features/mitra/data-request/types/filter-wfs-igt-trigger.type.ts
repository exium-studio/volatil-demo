// src/features/mitra/data-request/types/filter-wfs-igt-trigger.type.ts

import type React from "react";

export type WfsIgtFilterOptionDetail = {
  value: string;
  label: string;
  description?: string;
};

export type WfsIgtFilterValues = Record<
  string,
  WfsIgtFilterOptionDetail | null
>;

export type WfsIgtFilterSelectProps = {
  modalKey?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    details: WfsIgtFilterOptionDetail | null,
    value: string,
  ) => void;
  disabled?: boolean;
};

export type WfsIgtFilterTriggerProps = {
  children: React.ReactNode;
  value?: WfsIgtFilterValues;
  defaultValue?: WfsIgtFilterValues;
  defaultValues?: WfsIgtFilterValues;
  onFilterChange?: (filters: WfsIgtFilterValues) => void;
  onApply?: (filters: WfsIgtFilterValues) => void;
};
