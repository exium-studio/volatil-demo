// src/features/mitra/data-request/components/igt-filter.provinsi-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type {
  IgtFilterOptionDetail,
  IgtFilterSelectProps,
} from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { useFilterOptionsProvinsi } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export const IgtFilterProvinsiSelect = (props: IgtFilterSelectProps) => {
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
  const { data: provinsiOptionsData, isLoading } = useFilterOptionsProvinsi();
  const selectOptions: FocusSelectOption[] = (
    provinsiOptionsData?.data ?? []
  ).map((item) => ({
    label: item.label,
    value: item.value,
  }));

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
      modalKey={modalKey ?? "igt-filter-provinsi-select-modal"}
      label={"Provinsi"}
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
export const WfsIgtFilterProvinsiSelect = IgtFilterProvinsiSelect;
