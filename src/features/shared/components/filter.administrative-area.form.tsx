// src/features/shared/components/filter.administrative-area.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import { FilterAdministrativeAreaDistrictSelect } from "@/features/shared/components/filter.administrative-area.district-select";
import { FilterAdministrativeAreaProvinceSelect } from "@/features/shared/components/filter.administrative-area.province-select";
import { FilterAdministrativeAreaRegencySelect } from "@/features/shared/components/filter.administrative-area.regency-select";
import { FilterAdministrativeAreaSubdistrictSelect } from "@/features/shared/components/filter.administrative-area.subdistrict-select";
import type {
  FilterAdministrativeAreaFormProps,
  FilterAdministrativeAreaOptionDetail,
  FilterAdministrativeAreaValues,
} from "@/features/shared/types/filter.administrative-area.type";
import { t } from "@/shared/libs/i18n";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export const FilterAdministrativeAreaForm = (
  props: FilterAdministrativeAreaFormProps,
) => {
  // Props
  const {
    value: controlledValue,
    defaultValue = {},
    modalKeyPrefix = "filter-administrative-area",
    onChange,
    onApply,
    onReset,
    showActionButtons = true,
    showAlert = true,
    alertDescription = "Pilih wilayah administratif untuk menentukan batas area (AOI) untuk mengambil data IGT.",
  } = props;

  // States
  const [internalValue, setInternalValue] =
    useState<FilterAdministrativeAreaValues>(defaultValue);

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled ? controlledValue : internalValue;

  const isApplyDisabled = !currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value;

  // Handlers
  const handleFieldChange = (
    fieldKey: string,
    details: FilterAdministrativeAreaOptionDetail | null,
  ) => {
    const next = { ...currentValues, [fieldKey]: details };

    // Cascade reset child fields when parent field changes
    if (fieldKey === IGT_FILTER_KEYS_MAP.PROVINSI) {
      delete next[IGT_FILTER_KEYS_MAP.KABUPATEN];
      delete next[IGT_FILTER_KEYS_MAP.KECAMATAN];
      delete next[IGT_FILTER_KEYS_MAP.KELURAHAN];
    } else if (fieldKey === IGT_FILTER_KEYS_MAP.KABUPATEN) {
      delete next[IGT_FILTER_KEYS_MAP.KECAMATAN];
      delete next[IGT_FILTER_KEYS_MAP.KELURAHAN];
    } else if (fieldKey === IGT_FILTER_KEYS_MAP.KECAMATAN) {
      delete next[IGT_FILTER_KEYS_MAP.KELURAHAN];
    }

    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleReset = () => {
    const emptyFilters: FilterAdministrativeAreaValues = {};
    if (!isControlled) {
      setInternalValue(emptyFilters);
    }
    onChange?.(emptyFilters);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.(currentValues);
  };

  return (
    <VStack flex={1} justify={"space-between"} gap={"md"} w={"full"}>
      <VStack gap={"md"} w={"full"}>
        {showAlert && (
          <Alert.Root status={"info"} colorPalette={"blue"} w={"full"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{alertDescription}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <VStack gap={"md"} w={"full"}>
          <Field
            label={"Provinsi"}
            hasValue={Boolean(
              currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value,
            )}
          >
            <FilterAdministrativeAreaProvinceSelect
              modalKey={`${modalKeyPrefix}.${IGT_FILTER_KEYS_MAP.PROVINSI}`}
              value={currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value ?? ""}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.PROVINSI, details)
              }
            />
          </Field>

          <Field
            label={"Kabupaten / Kota"}
            hasValue={Boolean(
              currentValues[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value,
            )}
          >
            <FilterAdministrativeAreaRegencySelect
              modalKey={`${modalKeyPrefix}.${IGT_FILTER_KEYS_MAP.KABUPATEN}`}
              provinceId={currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              value={currentValues[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value ?? ""}
              disabled={!currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KABUPATEN, details)
              }
            />
          </Field>

          <Field
            label={"Kecamatan"}
            hasValue={Boolean(
              currentValues[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value,
            )}
          >
            <FilterAdministrativeAreaDistrictSelect
              modalKey={`${modalKeyPrefix}.${IGT_FILTER_KEYS_MAP.KECAMATAN}`}
              provinceId={currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              regencyId={currentValues[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value}
              value={currentValues[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value ?? ""}
              disabled={!currentValues[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KECAMATAN, details)
              }
            />
          </Field>

          <Field
            label={"Kelurahan / Desa"}
            hasValue={Boolean(
              currentValues[IGT_FILTER_KEYS_MAP.KELURAHAN]?.value,
            )}
          >
            <FilterAdministrativeAreaSubdistrictSelect
              modalKey={`${modalKeyPrefix}.${IGT_FILTER_KEYS_MAP.KELURAHAN}`}
              provinceId={currentValues[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              regencyId={currentValues[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value}
              districtId={currentValues[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value}
              value={currentValues[IGT_FILTER_KEYS_MAP.KELURAHAN]?.value ?? ""}
              disabled={!currentValues[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KELURAHAN, details)
              }
            />
          </Field>
        </VStack>
      </VStack>

      {showActionButtons && (
        <VStack gap={"xs"} w={"full"} mt={"auto"}>
          <Button
            primary={true}
            w={"full"}
            onClick={handleApply}
            disabled={isApplyDisabled}
          >
            <AppIcon icon={CheckIcon} />
            {"Terapkan Filter"}
          </Button>

          <Button variant={"outline"} w={"full"} onClick={handleReset}>
            {t["action.reset"]()}
          </Button>
        </VStack>
      )}
    </VStack>
  );
};
