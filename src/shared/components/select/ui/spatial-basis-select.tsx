// src/shared/components/select/ui/spatial-basis-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";

export const DEFAULT_SPATIAL_BASIS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Basis" },
  { value: "bidang", label: "Bidang" },
  { value: "kawasan", label: "Kawasan" },
];

export type SpatialBasisSelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: FocusSelectOption[];
  placeholder?: string;
  modalKey?: string;
  w?: string | number;
  disabled?: boolean;
  clearable?: boolean;
};

export const SpatialBasisSelect = (props: SpatialBasisSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "all",
    onValueChange,
    options = DEFAULT_SPATIAL_BASIS_OPTIONS,
    placeholder = "Semua Basis",
    modalKey = "spatial-basis-filter-modal",
    w = "150px",
    disabled = false,
    clearable = false,
  } = props;

  return (
    <FocusSelectInput
      modalKey={modalKey}
      placeholder={placeholder}
      options={options}
      value={value ?? defaultValue}
      onValueChange={(val) => onValueChange?.(val ?? defaultValue)}
      w={w}
      disabled={disabled}
      clearable={clearable}
    />
  );
};
