// src/features/shared/components/filter.administrative-area.district-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import type {
  FilterAdministrativeAreaOptionDetail,
  FilterAdministrativeAreaSelectProps,
} from "@/features/shared/types/filter.administrative-area.type";
import { useFilterOptionsKecamatan } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export type FilterAdministrativeAreaDistrictSelectProps =
  FilterAdministrativeAreaSelectProps & {
    regencyId?: string;
  };

export const FilterAdministrativeAreaDistrictSelect = (
  props: FilterAdministrativeAreaDistrictSelectProps,
) => {
  // Props
  const {
    modalKey,
    regencyId,
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
  const { data: kecamatanOptionsData, isLoading } = useFilterOptionsKecamatan({
    kabupatenId: regencyId,
  });
  const selectOptions: FocusSelectOption[] = (
    kecamatanOptionsData?.data ?? []
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
      modalKey={modalKey ?? "filter-administrative-area-district-select-modal"}
      label={"Kecamatan"}
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
      loading={isLoading}
      disabled={disabled}
    />
  );
};
