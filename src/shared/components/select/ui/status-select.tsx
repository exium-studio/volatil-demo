// src/shared/components/select/ui/status-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";

export const DEFAULT_GENERIC_STATUS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

export type StatusSelectProps = {
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

export const StatusSelect = (props: StatusSelectProps) => {
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
