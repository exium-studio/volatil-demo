// src/features/mitra/data-request/components/wfs-igt-filter.kelurahan-select.tsx

import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { useFilterOptionsKelurahan } from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import type {
  WfsIgtFilterOptionDetail,
  WfsIgtFilterSelectProps,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { useState } from "react";

export type WfsIgtFilterKelurahanSelectProps = WfsIgtFilterSelectProps & {
  kecamatanId?: string;
};

export const WfsIgtFilterKelurahanSelect = (
  props: WfsIgtFilterKelurahanSelectProps,
) => {
  // Props
  const {
    modalKey,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
    kecamatanId,
  } = props;

  // States (Uncontrolled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Hooks (TanStack Query)
  const { data: kelurahanResponse, isFetching } = useFilterOptionsKelurahan(
    kecamatanId ? { kecamatanId } : undefined,
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
      label={"Kelurahan / Desa"}
      placeholder={"Pilih Kelurahan / Desa"}
      options={kelurahanResponse?.data ?? []}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      isFetching={isFetching}
      customOption={true}
    />
  );
};
