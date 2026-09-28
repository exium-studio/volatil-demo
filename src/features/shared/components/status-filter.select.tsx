// src/features/shared/components/status-filter.select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type { StatusFilterSelectProps } from "@/features/shared/types/status-filter-select.type";

export const DEFAULT_GENERIC_STATUS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

export const StatusFilterSelect = (props: StatusFilterSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "all",
    onValueChange,
    options = DEFAULT_GENERIC_STATUS_OPTIONS,
    placeholder = "Semua Status",
    modalKey = "status-filter-modal",
    w = "160px",
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
