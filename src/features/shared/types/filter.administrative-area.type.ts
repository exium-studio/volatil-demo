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
  customOption?: boolean;
};

export type FilterAdministrativeAreaRegencySelectProps =
  FilterAdministrativeAreaSelectProps & {
    provinceId?: string;
  };

export type FilterAdministrativeAreaDistrictSelectProps =
  FilterAdministrativeAreaSelectProps & {
    regencyId?: string;
  };

export type FilterAdministrativeAreaSubdistrictSelectProps =
  FilterAdministrativeAreaSelectProps & {
    districtId?: string;
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

export type FilterAdministrativeAreaFormProps = {
  value?: FilterAdministrativeAreaValues;
  defaultValue?: FilterAdministrativeAreaValues;
  modalKeyPrefix?: string;
  onChange?: (values: FilterAdministrativeAreaValues) => void;
  onApply?: (values: FilterAdministrativeAreaValues) => void;
  onReset?: () => void;
  showActionButtons?: boolean;
  showAlert?: boolean;
  alertDescription?: string;
};

export const hasActiveAdministrativeFilter = (
  filters?: FilterAdministrativeAreaValues | null,
): boolean => {
  if (!filters) return false;
  return Object.values(filters).some(
    (val) => val !== null && val !== undefined && Boolean(val.value),
  );
};
