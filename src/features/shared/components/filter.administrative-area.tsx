// src/features/shared/components/filter.administrative-area.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { FilterAdministrativeAreaForm } from "@/features/shared/components/filter.administrative-area.form";
import type {
  FilterAdministrativeAreaTriggerProps,
  FilterAdministrativeAreaValues,
} from "@/features/shared/types/filter.administrative-area.type";
import { t } from "@/shared/libs/i18n";
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
        position={"relative"}
        onClick={() => {
          setLocalDraftFilters(currentAppliedFilters);
          open();
        }}
        cursor={"pointer"}
      >
        {children}
        {activeFilterCount > 0 && (
          <CountBadge count={activeFilterCount} floating={true} />
        )}
      </Box>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{"Filter Wilayah Administratif"}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={"md"}>
          <FilterAdministrativeAreaForm
            modalKeyPrefix={modalKey}
            value={localDraftFilters}
            onChange={(next) => setLocalDraftFilters(next)}
            showActionButtons={false}
            showAlert={true}
          />
        </Modal.Body>

        <Modal.Footer gap={"sm"}>
          <VStack gap={"xs"} w={"full"}>
            <Button primary={true} onClick={handleApply}>
              {"Terapkan Filter"}
            </Button>

            <Button variant={"outline"} onClick={handleReset}>
              {t["action.reset"]()}
            </Button>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

