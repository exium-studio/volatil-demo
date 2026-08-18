// src/features/mitra/data-request/components/igt-filter.tema-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type {
  IgtFilterOptionDetail,
  IgtFilterSelectProps,
} from "@/features/shared/types/filter-igt-trigger.type";
import { useFilterOptionsTema } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export const IgtFilterTemaSelect = (props: IgtFilterSelectProps) => {
  // Props
  const {
    modalKey,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
  } = props;

  // States
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Queries
  const { data: temaOptionsData, isLoading } = useFilterOptionsTema();
  const selectOptions: FocusSelectOption[] = (temaOptionsData?.data ?? []).map(
    (item) => ({
      label: item.label,
      value: item.value,
    }),
  );

  // Handlers
  const handleValueChange = (val: string, option?: IgtFilterOptionDetail) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    const details =
      val && option ? { value: option.value, label: option.label } : null;
    onValueChange?.(details, val);
  };

  return (
    <FocusSelectInput
      modalKey={modalKey ?? "igt-filter-tema-select-modal"}
      label={"Tema IGT"}
      placeholder={t["action.select"]()}
      options={selectOptions}
      value={currentValue}
      onValueChange={(val, optionDetail) =>
        handleValueChange(
          val,
          optionDetail
            ? { value: optionDetail.value, label: optionDetail.label }
            : undefined,
        )
      }
      disabled={disabled}
      isFetching={isLoading}
      customOption={true}
    />
  );
};

// Aliases for compatibility
export const WfsIgtFilterTemaSelect = IgtFilterTemaSelect;
