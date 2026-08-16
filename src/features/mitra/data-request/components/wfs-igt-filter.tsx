// src/features/mitra/data-request/components/wfs-igt-filter.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { MODAL, SPACING } from "@/design-system/constants/styles";
import { WfsIgtFilterBasisSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.basis-select";
import { WfsIgtFilterKabupatenSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.kabupaten-select";
import { WfsIgtFilterKecamatanSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.kecamatan-select";
import { WfsIgtFilterKelurahanSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.kelurahan-select";
import { WfsIgtFilterProvinsiSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.provinsi-select";
import { WfsIgtFilterTemaSelect } from "@/features/mitra/data-request/components/wfs-igt-filter.tema-select";
import { WFS_IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import type {
  WfsIgtFilterOptionDetail,
  WfsIgtFilterTriggerProps,
  WfsIgtFilterValues,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { useEffect, useMemo, useState } from "react";

export const WfsIgtFilterTrigger = (props: WfsIgtFilterTriggerProps) => {
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
    useState<WfsIgtFilterValues>(defaultValue ?? defaultValues ?? {});

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
    modalKey: customModalKey ?? "wfs-igt-filter-modal",
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
    }, MODAL.animationDurationMs);

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
    setLocalDraftFilters((prev) => {
      const next = { ...prev, [key]: details };

      // Cascading: provinsi changed → reset kabupaten, kecamatan, and kelurahan
      if (key === WFS_IGT_FILTER_KEYS_MAP.PROVINSI) {
        next[WFS_IGT_FILTER_KEYS_MAP.KABUPATEN] = null;
        next[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN] = null;
        next[WFS_IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
      }

      // Cascading: kabupaten changed → reset kecamatan and kelurahan
      if (key === WFS_IGT_FILTER_KEYS_MAP.KABUPATEN) {
        next[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN] = null;
        next[WFS_IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
      }

      // Cascading: kecamatan changed → reset kelurahan
      if (key === WFS_IGT_FILTER_KEYS_MAP.KECAMATAN) {
        next[WFS_IGT_FILTER_KEYS_MAP.KELURAHAN] = null;
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
              {"Filter Data IGT-PR"}
            </Modal.Title>

            {activeFilterCount > 0 && (
              <CountBadge count={activeFilterCount} colorPalette={"blue"} />
            )}
          </HStack>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={SPACING.md}>
          <VStack gap={SPACING.md} w={"full"}>
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
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KABUPATEN]?.value ??
                ""
              }
              disabled={
                !localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.PROVINSI]?.value
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
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN]?.value ??
                ""
              }
              disabled={
                !localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KABUPATEN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.KECAMATAN, details)
              }
            />

            <WfsIgtFilterKelurahanSelect
              modalKey={`${modalKey}.${WFS_IGT_FILTER_KEYS_MAP.KELURAHAN}`}
              kecamatanId={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN]?.value
              }
              value={
                localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KELURAHAN]?.value ??
                ""
              }
              disabled={
                !localDraftFilters[WFS_IGT_FILTER_KEYS_MAP.KECAMATAN]?.value
              }
              onValueChange={(details) =>
                handleFieldChange(WFS_IGT_FILTER_KEYS_MAP.KELURAHAN, details)
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
