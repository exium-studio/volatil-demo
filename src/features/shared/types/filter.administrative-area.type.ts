// src/features/shared/types/filter.administrative-area.type.ts

import type React from "react";

export type FilterAdministrativeAreaOptionDetail = {
  value: string;
  label: string;
  description?: string;
};

export type FilterAdministrativeAreaValues = Record<
  string,
  FilterAdministrativeAreaOptionDetail | null
>;

export type FilterAdministrativeAreaSelectProps = {
  modalKey?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    details: FilterAdministrativeAreaOptionDetail | null,
    value: string,
  ) => void;
  disabled?: boolean;
};

export type FilterAdministrativeAreaTriggerProps = {
  children: React.ReactNode;
  modalKey?: string;
  value?: FilterAdministrativeAreaValues;
  defaultValue?: FilterAdministrativeAreaValues;
  defaultValues?: FilterAdministrativeAreaValues;
  onFilterChange?: (filters: FilterAdministrativeAreaValues) => void;
  onApply?: (filters: FilterAdministrativeAreaValues) => void;
};
