// src/features/shared/components/filter.administrative-area.subdistrict-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type {
  FilterAdministrativeAreaOptionDetail,
  FilterAdministrativeAreaSubdistrictSelectProps,
} from "@/features/shared/types/filter.administrative-area.type";
import { useFilterOptionsKelurahan } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export const FilterAdministrativeAreaSubdistrictSelect = (
  props: FilterAdministrativeAreaSubdistrictSelectProps,
) => {
  // Props
  const {
    modalKey,
    districtId,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
    customOption = true,
  } = props;

  // States
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Queries
  const { data: kelurahanOptionsData, isLoading } = useFilterOptionsKelurahan({
    kecamatanId: districtId,
  });
  const selectOptions: FocusSelectOption[] = (
    kelurahanOptionsData?.data ?? []
  ).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  // Handlers
  const handleValueChange = (
    val: string,
    option?: FilterAdministrativeAreaOptionDetail,
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
      modalKey={modalKey ?? "filter-administrative-area-subdistrict-select-modal"}
      label={"Kelurahan / Desa"}
      placeholder={t["action.select"]()}
      options={selectOptions}
      value={currentValue}
      customOption={customOption}
      onValueChange={(val, optionDetail) =>
        handleValueChange(
          val,
          optionDetail
            ? { value: optionDetail.value, label: optionDetail.label }
            : undefined,
        )
      }
      loading={isLoading}
      disabled={disabled}
    />
  );
};
