// src/features/mitra/data-request/components/wfs-igt-filter.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import {
  MODAL_ANIMATION_DURATION_MS,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { WfsIgtFilterBasisSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.basis-select";
import { WfsIgtFilterKabupatenSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.kabupaten-select";
import { WfsIgtFilterKecamatanSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.kecamatan-select";
import { WfsIgtFilterProvinsiSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.provinsi-select";
import { WfsIgtFilterTemaSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.tema-select";
import { WFS_IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import type {
  WfsIgtFilterOptionDetail,
  WfsIgtFilterTriggerProps,
  WfsIgtFilterValues,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { useEffect, useState } from "react";

export const WfsIgtFilterTrigger = (props: WfsIgtFilterTriggerProps) => {
  // Props
  const {
    children,
    value: controlledValue,
    defaultValue,
    defaultValues,
    onFilterChange,
    onApply,
  } = props;

  // Uncontrolled applied state (internal)
  const [internalAppliedFilters, setInternalAppliedFilters] =
    useState<WfsIgtFilterValues>(defaultValue ?? defaultValues ?? {});

  // Determine current applied filters (controlled vs uncontrolled)
  const isControlled = controlledValue !== undefined;
  const currentAppliedFilters = isControlled
    ? controlledValue
    : internalAppliedFilters;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "wfs-igt-filter-modal",
  });

  // Local draft state inside modal (editing before click "Terapkan Filter")
  const [localDraftFilters, setLocalDraftFilters] =
    useState<WfsIgtFilterValues>(currentAppliedFilters);

  // Synchronize local draft state with applied filters ONLY after modal animation finishes
  useEffect(() => {
    let isCancelled = false;

    if (!isOpen) return;

    const timerId = setTimeout(() => {
      if (!isCancelled) {
        setLocalDraftFilters(currentAppliedFilters);
      }
    }, MODAL_ANIMATION_DURATION_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [isOpen, currentAppliedFilters]);

  // Handlers
  const handleFieldChange = (
    key: string,
    details: WfsIgtFilterOptionDetail | null,
  ) => {
    setLocalDraftFilters((prev) => ({
      ...prev,
      [key]: details,
    }));
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
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title fontWeight={"semibold"}>
            {"Filter Data IGT-PR"}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={SPACING_MD}>
          <VStack gap={SPACING_MD} w={"full"}>
            <WfsIgtFilterBasisSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.BASIS}`}
              value={localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.BASIS]?.value}
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.BASIS, details)
              }
            />

            <WfsIgtFilterTemaSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.TEMA}`}
              value={localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.TEMA]?.value}
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.TEMA, details)
              }
            />

            <WfsIgtFilterProvinsiSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.PROVINSI}`}
              value={localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.PROVINSI]?.value}
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.PROVINSI, details)
              }
            />

            <WfsIgtFilterKabupatenSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.KABUPATEN}`}
              provinsiId={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.PROVINSI]?.value
              }
              value={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KABUPATEN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.KABUPATEN, details)
              }
            />

            <WfsIgtFilterKecamatanSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.KECAMATAN}`}
              kabupatenId={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KABUPATEN]?.value
              }
              value={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.KECAMATAN, details)
              }
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer gap={SPACING_SM}>
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
