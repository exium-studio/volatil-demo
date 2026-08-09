// src/features/mitra/data-request/components/wfs-igt-filter-trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import {
  MODAL_ANIMATION_DURATION_MS,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { WFS_IGT_FILTER_FIELDS } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import {
  useFilterOptionsKabupaten,
  useFilterOptionsKecamatan,
  useFilterOptionsProvinsi,
  useFilterOptionsTema,
} from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import type {
  FocusSelectOption,
  WfsIgtFilterTriggerProps,
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
  } = props;

  // Uncontrolled applied state (internal)
  const [internalAppliedFilters, setInternalAppliedFilters] = useState<
    Record<string, string | undefined>
  >(defaultValue ?? defaultValues ?? {});

  // Determine current applied filters (controlled vs uncontrolled)
  const isControlled = controlledValue !== undefined;
  const currentAppliedFilters = isControlled
    ? controlledValue
    : internalAppliedFilters;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "wfs-igt-filter-modal",
  });

  // Queries (TanStack Query for filter options)
  const { data: temaData } = useFilterOptionsTema();
  const { data: provinsiData } = useFilterOptionsProvinsi();
  const { data: kabupatenData } = useFilterOptionsKabupaten();
  const { data: kecamatanData } = useFilterOptionsKecamatan();

  // Local draft state inside modal (editing before click "Terapkan Filter")
  const [localDraftFilters, setLocalDraftFilters] = useState<
    Record<string, string | undefined>
  >(currentAppliedFilters);

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

  // Derived Values — Map dynamic options per field key
  const optionsMap = useMemo<Record<string, FocusSelectOption[]>>(
    () => ({
      statbid: WFS_IGT_FILTER_FIELDS[0]?.options ?? [],
      tema: temaData?.data ?? [],
      provinsi: provinsiData?.data ?? [],
      kabupaten: kabupatenData?.data ?? [],
      kecamatan: kecamatanData?.data ?? [],
    }),
    [temaData, provinsiData, kabupatenData, kecamatanData],
  );

  // Handlers
  const handleSelectChange = (key: string, value: string) => {
    setLocalDraftFilters((prev) => ({
      ...prev,
      [key]: value,
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
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <P textAlign={"center"} fontWeight={"semibold"}>
            {"Filter Data IGT-PR"}
          </P>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={SPACING_MD}>
          <VStack gap={SPACING_MD} w={"full"}>
            {WFS_IGT_FILTER_FIELDS.map((fieldConfig) => (
              <FocusSelectInput
                key={fieldConfig.key}
                modalKey={fieldConfig.key}
                parentModalKey={modalKey}
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                options={optionsMap[fieldConfig.key] ?? []}
                value={localDraftFilters[fieldConfig.key]}
                onValueChange={(val) =>
                  handleSelectChange(fieldConfig.key, val)
                }
              />
            ))}
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
