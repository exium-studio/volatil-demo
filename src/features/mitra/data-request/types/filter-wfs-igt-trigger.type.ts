// src/features/mitra/data-request/types/filter-wfs-igt-trigger.type.ts

import type React from "react";

export type WfsIgtFilterTriggerProps = {
  children: React.ReactNode;
  value?: Record<string, string | undefined>;
  defaultValue?: Record<string, string | undefined>;
  defaultValues?: Record<string, string | undefined>;
  onFilterChange?: (filters: Record<string, string | undefined>) => void;
  onApply?: (filters: Record<string, string | undefined>) => void;
};

export type FocusSelectOption = {
  label: string;
  value: string;
};

export type FocusSelectFieldProps = {
  fieldKey: string;
  label: string;
  placeholder: string;
  options: FocusSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  parentModalKey?: string;
};
