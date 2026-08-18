// src/shared/components/select/ui/role-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";

export const DEFAULT_ROLE_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Role" },
  { value: "internal", label: "Internal" },
  { value: "mitra", label: "Mitra" },
];

export type RoleSelectProps = {
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

export const RoleSelect = (props: RoleSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "all",
    onValueChange,
    options = DEFAULT_ROLE_OPTIONS,
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
