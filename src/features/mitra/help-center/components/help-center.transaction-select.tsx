// src/features/mitra/help-center/components/help-center.transaction-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { useMitraTransactionsQuery } from "@/features/mitra/help-center/hooks/use-mitra-transactions.query";
import { t } from "@/shared/libs/i18n";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useMemo, useState } from "react";

export type HelpCenterTransactionSelectProps = {
  modalKey?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string, option?: FocusSelectOption) => void;
  disabled?: boolean;
};

export const HelpCenterTransactionSelect = (
  props: HelpCenterTransactionSelectProps,
) => {
  // Props
  const {
    modalKey = "help-center-transaction-select-modal",
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
  } = props;

  // States
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Queries
  const { transactions, isLoading } = useMitraTransactionsQuery();

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const selectOptions: FocusSelectOption[] = useMemo(() => {
    return transactions.map((item) => {
      const layerNames = item.items.map((it) => it.sourceLayerTitle).join(", ");
      return {
        value: item.id,
        label: layerNames
          ? `${item.orderNumber} - ${layerNames}`
          : item.orderNumber,
        description: `Rp. ${formatNumber(item.totalPrice)}`,
      };
    });
  }, [transactions]);

  // Handlers
  const handleValueChange = (val: string, option?: FocusSelectOption) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onValueChange?.(val, option);
  };

  return (
    <FocusSelectInput
      modalKey={modalKey}
      placeholder={t["action.select"]()}
      options={selectOptions}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      isFetching={isLoading}
      clearable={true}
    />
  );
};
