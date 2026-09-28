// src/features/shared/components/igt-basis-filter.select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type { IgtBasisFilterSelectProps } from "@/features/shared/types/igt-basis-filter-select.type";

export const DEFAULT_IGT_BASIS_FILTER_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Basis" },
  { value: "bidang", label: "Bidang" },
  { value: "kawasan", label: "Kawasan" },
];

export const IgtBasisFilterSelect = (props: IgtBasisFilterSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "all",
    onValueChange,
    options = DEFAULT_IGT_BASIS_FILTER_OPTIONS,
    placeholder = "Semua Basis",
    modalKey = "igt-basis-filter-modal",
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
