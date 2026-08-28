// src/features/shared/components/filter.administrative-area.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { FilterAdministrativeAreaDistrictSelect } from "@/features/shared/components/filter.administrative-area.district-select";
import { FilterAdministrativeAreaProvinceSelect } from "@/features/shared/components/filter.administrative-area.province-select";
import { FilterAdministrativeAreaRegencySelect } from "@/features/shared/components/filter.administrative-area.regency-select";
import { FilterAdministrativeAreaSubdistrictSelect } from "@/features/shared/components/filter.administrative-area.subdistrict-select";
import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type {
  FilterAdministrativeAreaOptionDetail,
  FilterAdministrativeAreaTriggerProps,
  FilterAdministrativeAreaValues,
} from "@/features/shared/types/filter.administrative-area.type";
import { useEffect, useMemo, useState } from "react";

export const FilterAdministrativeAreaTrigger = (
  props: FilterAdministrativeAreaTriggerProps,
) => {
  // Props
  const {
    children,
    value: controlledValue,
    defaultValue,
    defaultValues,
    onFilterChange,
    onApply,
    modalKey: customModalKey,
  } = props;

  // Uncontrolled applied state (internal)
  const [internalAppliedFilters, setInternalAppliedFilters] =
    useState<FilterAdministrativeAreaValues>(
      defaultValue ?? defaultValues ?? {},
    );

  // Determine current applied filters (controlled vs uncontrolled)
  const isControlled = controlledValue !== undefined;
  const currentAppliedFilters = isControlled
    ? controlledValue
    : internalAppliedFilters;

  // Derived Values
  const activeFilterCount = useMemo(() => {
    return Object.values(currentAppliedFilters).filter(
      (val) => val !== null && val !== undefined && Boolean(val.value),
    ).length;
  }, [currentAppliedFilters]);

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey ?? "filter-administrative-area-modal",
  });

  // Local draft state inside modal (editing before click "Terapkan Filter")
  const [localDraftFilters, setLocalDraftFilters] =
    useState<FilterAdministrativeAreaValues>(currentAppliedFilters);

  // Synchronize local draft state with applied filters ONLY after modal animation finishes
  useEffect(() => {
    let isCancelled = false;

    if (!isOpen) return;

    const timerId = setTimeout(() => {
      if (!isCancelled) {
        setLocalDraftFilters(currentAppliedFilters);
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [isOpen, currentAppliedFilters]);

  // Handlers
  const handleFieldChange = (
    fieldKey: string,
    details: FilterAdministrativeAreaOptionDetail | null,
  ) => {
    setLocalDraftFilters((prev) => {
      const next = { ...prev, [fieldKey]: details };

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

      return next;
    });
  };

  const handleReset = () => {
    const emptyFilters: FilterAdministrativeAreaValues = {};
    setLocalDraftFilters(emptyFilters);
    if (!isControlled) {
      setInternalAppliedFilters(emptyFilters);
    }
    onFilterChange?.(emptyFilters);
    onApply?.(emptyFilters);
    close();
  };

  const handleApply = () => {
    if (!isControlled) {
      setInternalAppliedFilters(localDraftFilters);
    }
    onFilterChange?.(localDraftFilters);
    onApply?.(localDraftFilters);
    close();
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      scrollBehavior={"inside"}
      size={"sm"}
      onExitComplete={() => {
        setLocalDraftFilters(currentAppliedFilters);
      }}
    >
      <Box
        as={"span"}
        display={"inline-flex"}
        onClick={() => {
          setLocalDraftFilters(currentAppliedFilters);
          open();
        }}
        cursor={"pointer"}
      >
        {children}
      </Box>

      <Modal.Content>
        <Modal.Header>
          <HStack gap={"md"} align={"center"}>
            <Modal.Title>{"Filter Wilayah Administratif"}</Modal.Title>

            {activeFilterCount > 0 && <CountBadge count={activeFilterCount} />}
          </HStack>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={"md"}>
          <Alert.Root status={"info"} colorPalette={"blue"} w={"full"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title fontWeight={"semibold"}>
                {"Informasi Filter Wilayah Administratif"}
              </Alert.Title>

              <Alert.Description>
                {
                  "Filter wilayah administratif yang diterapkan akan berlaku secara menyeluruh pada katalog layer IGT dan tabel atribut."
                }
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <VStack gap={"md"} w={"full"}>
            <FilterAdministrativeAreaProvinceSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.PROVINSI}`}
              value={localDraftFilters[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.PROVINSI, details)
              }
            />

            <FilterAdministrativeAreaRegencySelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KABUPATEN}`}
              provinceId={
                localDraftFilters[IGT_FILTER_KEYS_MAP.PROVINSI]?.value
              }
              value={
                localDraftFilters[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value ?? ""
              }
              disabled={!localDraftFilters[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KABUPATEN, details)
              }
            />

            <FilterAdministrativeAreaDistrictSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KECAMATAN}`}
              regencyId={
                localDraftFilters[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value
              }
              value={
                localDraftFilters[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value ?? ""
              }
              disabled={
                !localDraftFilters[IGT_FILTER_KEYS_MAP.KABUPATEN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KECAMATAN, details)
              }
            />

            <FilterAdministrativeAreaSubdistrictSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KELURAHAN}`}
              districtId={
                localDraftFilters[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value
              }
              value={
                localDraftFilters[IGT_FILTER_KEYS_MAP.KELURAHAN]?.value ?? ""
              }
              disabled={
                !localDraftFilters[IGT_FILTER_KEYS_MAP.KECAMATAN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.KELURAHAN, details)
              }
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer gap={"sm"}>
          <VStack gap={"xs"} w={"full"}>
            <Button primary onClick={handleApply}>
              {"Terapkan Filter"}
            </Button>

            <Button onClick={handleReset}>{"Reset"}</Button>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
