// src/features/mitra/data-request/components/igt-filter.kabupaten-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type {
  IgtFilterOptionDetail,
  IgtFilterSelectProps,
} from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { useFilterOptionsKabupaten } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export type IgtFilterKabupatenSelectProps = IgtFilterSelectProps & {
  provinsiId?: string;
};

export const IgtFilterKabupatenSelect = (
  props: IgtFilterKabupatenSelectProps,
) => {
  // Props
  const {
    modalKey,
    provinsiId,
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
  const { data: kabupatenOptionsData, isLoading } = useFilterOptionsKabupaten({
    provinsiId,
  });
  const selectOptions: FocusSelectOption[] = (
    kabupatenOptionsData?.data ?? []
  ).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  // Handlers
  const handleValueChange = (
    val: string,
    option?: IgtFilterOptionDetail,
  ) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    const details =
      val && option ? { value: option.value, label: option.label } : null;
    onValueChange?.(details, val);
  };

  return (
    <FocusSelectInput
      modalKey={modalKey ?? "igt-filter-kabupaten-select-modal"}
      label={"Kabupaten / Kota"}
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
      disabled={disabled || !provinsiId}
      isFetching={isLoading}
      customOption={true}
    />
  );
};

// Aliases for compatibility
export type WfsIgtFilterKabupatenSelectProps = IgtFilterKabupatenSelectProps;
export const WfsIgtFilterKabupatenSelect = IgtFilterKabupatenSelect;
