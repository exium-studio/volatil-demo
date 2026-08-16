// src/features/mitra/data-request/components/igt-filter.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { MODAL, SPACING } from "@/design-system/constants/styles";
import { IgtFilterBasisSelect } from "@/features/mitra/data-request/components/igt-filter.basis-select";
import { IgtFilterKabupatenSelect } from "@/features/mitra/data-request/components/igt-filter.kabupaten-select";
import { IgtFilterKecamatanSelect } from "@/features/mitra/data-request/components/igt-filter.kecamatan-select";
import { IgtFilterKelurahanSelect } from "@/features/mitra/data-request/components/igt-filter.kelurahan-select";
import { IgtFilterProvinsiSelect } from "@/features/mitra/data-request/components/igt-filter.provinsi-select";
import { IgtFilterTemaSelect } from "@/features/mitra/data-request/components/igt-filter.tema-select";
import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt-filter.config";
import type {
  IgtFilterOptionDetail,
  IgtFilterTriggerProps,
  IgtFilterValues,
} from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { useEffect, useMemo, useState } from "react";

export const IgtFilterTrigger = (props: IgtFilterTriggerProps) => {
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
    useState<IgtFilterValues>(defaultValue ?? defaultValues ?? {});

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
    modalKey: customModalKey ?? "igt-filter-modal",
  });

  // Local draft state inside modal (editing before click "Terapkan Filter")
  const [localDraftFilters, setLocalDraftFilters] =
    useState<IgtFilterValues>(currentAppliedFilters);

  // Synchronize local draft state with applied filters ONLY after modal animation finishes
  useEffect(() => {
    let isCancelled = false;

    if (!isOpen) return;

    const timerId = setTimeout(() => {
      if (!isCancelled) {
        setLocalDraftFilters(currentAppliedFilters);
      }
    }, MODAL.animationDurationMs);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [isOpen, currentAppliedFilters]);

  // Handlers
  const handleFieldChange = (
    key: string,
    details: IgtFilterOptionDetail | null,
  ) => {
    setLocalDraftFilters((prev) => {
      const next = { ...prev, [key]: details };

      // Cascading: provinsi changed → reset kabupaten, kecamatan, and kelurahan
      if (key === IGT_FILTER_KEYS_MAP.PROVINSI) {
        next[IGT_FILTER_KEYS_MAP.KABUPATEN] = null;
        next[IGT_FILTER_KEYS_MAP.KECAMATAN] = null;
        next[IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
      }

      // Cascading: kabupaten changed → reset kecamatan and kelurahan
      if (key === IGT_FILTER_KEYS_MAP.KABUPATEN) {
        next[IGT_FILTER_KEYS_MAP.KECAMATAN] = null;
        next[IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
      }

      // Cascading: kecamatan changed → reset kelurahan
      if (key === IGT_FILTER_KEYS_MAP.KECAMATAN) {
        next[IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
      }

      return next;
    });
  };

  const handleReset = () => {
    setLocalDraftFilters({});
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
      size={"sm"}
    >
      <Box pos={"relative"} display={"inline-block"}>
        <Modal.Trigger>{children}</Modal.Trigger>
        {activeFilterCount > 0 && (
          <CountBadge
            count={activeFilterCount}
            isFloating={true}
            colorPalette={"blue"}
          />
        )}
      </Box>

      <Modal.Content>
        <Modal.Header>
          <HStack gap={2} align={"center"}>
            <Modal.Title fontWeight={"semibold"}>
              {"Filter Data IGT"}
            </Modal.Title>

            {activeFilterCount > 0 && (
              <CountBadge count={activeFilterCount} colorPalette={"blue"} />
            )}
          </HStack>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={SPACING.md}>
          {/* Info Alert at the top of modal body */}
          <Alert.Root status={"info"} colorPalette={"blue"} w={"full"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title fontWeight={"semibold"}>
                {"Informasi Filter IGT"}
              </Alert.Title>
              <Alert.Description fontSize={"xs"}>
                {
                  "Filter yang diterapkan akan berlaku secara menyeluruh pada katalog layer IGT, tabel atribut, dan tampilan peta."
                }
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <VStack gap={SPACING.md} w={"full"}>
            <IgtFilterBasisSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.BASIS}`}
              value={localDraftFilters[IGT_FILTER_KEYS_MAP.BASIS]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.BASIS, details)
              }
            />

            <IgtFilterTemaSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.TEMA}`}
              value={localDraftFilters[IGT_FILTER_KEYS_MAP.TEMA]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.TEMA, details)
              }
            />

            <IgtFilterProvinsiSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.PROVINSI}`}
              value={localDraftFilters[IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              onValueChange={(details) =>
                handleFieldChange(IGT_FILTER_KEYS_MAP.PROVINSI, details)
              }
            />

            <IgtFilterKabupatenSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KABUPATEN}`}
              provinsiId={
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

            <IgtFilterKecamatanSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KECAMATAN}`}
              kabupatenId={
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

            <IgtFilterKelurahanSelect
              modalKey={`${modalKey}.${IGT_FILTER_KEYS_MAP.KELURAHAN}`}
              kecamatanId={
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

        <Modal.Footer gap={SPACING.sm}>
          <Button variant={"outline"} flex={1} onClick={handleReset}>
            {"Reset"}
          </Button>

          <Button primary flex={1} onClick={handleApply}>
            {"Terapkan Filter"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

// Aliases for compatibility
export const WfsIgtFilterTrigger = IgtFilterTrigger;
