// src/features/mitra/data-request/types/filter-igt-trigger.type.ts

import type React from "react";

export type IgtFilterOptionDetail = {
  value: string;
  label: string;
  description?: string;
};

export type IgtFilterValues = Record<string, IgtFilterOptionDetail | null>;

export type IgtFilterSelectProps = {
  modalKey?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    details: IgtFilterOptionDetail | null,
    value: string,
  ) => void;
  disabled?: boolean;
};

export type IgtFilterTriggerProps = {
  children: React.ReactNode;
  modalKey?: string;
  value?: IgtFilterValues;
  defaultValue?: IgtFilterValues;
  defaultValues?: IgtFilterValues;
  onFilterChange?: (filters: IgtFilterValues) => void;
  onApply?: (filters: IgtFilterValues) => void;
};

// Aliases for compatibility
export type WfsIgtFilterOptionDetail = IgtFilterOptionDetail;
export type WfsIgtFilterValues = IgtFilterValues;
export type WfsIgtFilterSelectProps = IgtFilterSelectProps;
export type WfsIgtFilterTriggerProps = IgtFilterTriggerProps;
