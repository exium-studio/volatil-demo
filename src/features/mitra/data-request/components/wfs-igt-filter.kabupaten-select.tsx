// src/features/mitra/data-request/components/wfs-igt-filter.kabupaten-select.tsx

import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { useFilterOptionsKabupaten } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import type {
  WfsIgtFilterOptionDetail,
  WfsIgtFilterSelectProps,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { useState } from "react";

export type WfsIgtFilterKabupatenSelectProps = WfsIgtFilterSelectProps & {
  provinsiId?: string;
};

export const WfsIgtFilterKabupatenSelect = (
  props: WfsIgtFilterKabupatenSelectProps,
) => {
  // Props
  const {
    modalKey,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
    provinsiId,
  } = props;

  // States (Uncontrolled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Hooks (TanStack Query)
  const { data: kabupatenResponse, isFetching } = useFilterOptionsKabupaten(
    provinsiId ? { provinsiId } : undefined,
  );

  // Handlers
  const handleValueChange = (
    val: string,
    option?: WfsIgtFilterOptionDetail,
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
      modalKey={modalKey}
      label={"Kota / Kabupaten"}
      placeholder={"Pilih Kota / Kabupaten"}
      options={kabupatenResponse?.data ?? []}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      isFetching={isFetching}
      customOption={true}
    />
  );
};
