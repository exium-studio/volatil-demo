// src/features/mitra/data-request/components/wfs-igt-filter-basis-select.tsx

import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { WFS_IGT_FILTER_CONFIG } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import { useFilterOptionsBasis } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import type {
  WfsIgtFilterOptionDetail,
  WfsIgtFilterSelectProps,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { useState } from "react";

export const WfsIgtFilterBasisSelect = (props: WfsIgtFilterSelectProps) => {
  // Props
  const {
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
    parentModalKey,
  } = props;

  // States (Uncontrolled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const config = WFS_IGT_FILTER_CONFIG.basis;

  // Hooks (TanStack Query)
  const { data: basisResponse, isFetching } = useFilterOptionsBasis();

  // Handlers
  const handleValueChange = (
    val: string,
    option?: WfsIgtFilterOptionDetail,
  ) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    const details = option
      ? { value: option.value, label: option.label }
      : null;
    onValueChange?.(details, val);
  };

  return (
    <FocusSelectInput
      modalKey={config.key}
      parentModalKey={parentModalKey}
      label={config.label}
      placeholder={config.placeholder}
      options={basisResponse?.data ?? []}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      isFetching={isFetching}
    />
  );
};
