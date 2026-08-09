// src/features/mitra/data-request/types/filter-wfs-igt-trigger.type.ts

import type React from "react";

export type FilterWfsIgtTriggerProps = {
  children: React.ReactNode;
  onApply: (filters: Record<string, string | undefined>) => void;
  defaultValues?: Record<string, string | undefined>;
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
