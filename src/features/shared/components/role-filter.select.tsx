// src/features/shared/components/role-filter.select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type { RoleFilterSelectProps } from "@/features/shared/types/role-filter-select.type";

export const DEFAULT_ROLE_FILTER_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Role" },
  { value: "internal", label: "Internal" },
  { value: "mitra", label: "Mitra" },
];

export const RoleFilterSelect = (props: RoleFilterSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "all",
    onValueChange,
    options = DEFAULT_ROLE_FILTER_OPTIONS,
    placeholder = "Semua Role",
    modalKey = "role-filter-modal",
    w = "140px",
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
