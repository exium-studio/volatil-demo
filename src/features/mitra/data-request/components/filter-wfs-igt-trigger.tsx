// src/features/mitra/data-request/components/filter-wfs-igt-trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { WFS_IGT_FILTER_FIELDS } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import {
  useFilterOptionsKabupaten,
  useFilterOptionsKecamatan,
  useFilterOptionsProvinsi,
  useFilterOptionsTema,
} from "@/features/mitra/data-request/queries/use-mitra-data-request-filter.query";
import type {
  FilterWfsIgtTriggerProps,
  FocusSelectFieldProps,
  FocusSelectOption,
} from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

export const FilterWfsIgtTrigger = (props: FilterWfsIgtTriggerProps) => {
  // Props
  const { children, onApply, defaultValues = {} } = props;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "wfs-igt-filter-modal",
  });

  // Queries (TanStack Query for filter options)
  const { data: temaData } = useFilterOptionsTema();
  const { data: provinsiData } = useFilterOptionsProvinsi();
  const { data: kabupatenData } = useFilterOptionsKabupaten();
  const { data: kecamatanData } = useFilterOptionsKecamatan();

  // States
  const [localFilters, setLocalFilters] =
    useState<Record<string, string | undefined>>(defaultValues);

  // Synchronize local state with defaultValues when modal opens
  useEffect(() => {
    let isCancelled = false;

    const syncDefaultValues = async () => {
      await Promise.resolve();
      if (!isCancelled && isOpen) {
        setLocalFilters(defaultValues);
      }
    };

    void syncDefaultValues();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, defaultValues]);

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
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onApply(localFilters);
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
              <FocusSelectField
                key={fieldConfig.key}
                fieldKey={fieldConfig.key}
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                options={optionsMap[fieldConfig.key] ?? []}
                value={localFilters[fieldConfig.key]}
                onChange={(val) => handleSelectChange(fieldConfig.key, val)}
                parentModalKey={modalKey}
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

const FocusSelectField = (props: FocusSelectFieldProps) => {
  // Props
  const {
    fieldKey,
    label,
    placeholder,
    options,
    value,
    onChange,
    parentModalKey = "wfs-igt-filter-modal",
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks — Nested subModalKey uses dot notation so parent modal stays open
  const subModalKey = `${parentModalKey}.${fieldKey}`;
  const { isOpen, open, close } = usePopModal({
    modalKey: subModalKey,
  });

  // States
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Derived Values
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [options, searchQuery],
  );

  // Handlers
  const handleOptionClick = (val: string) => {
    onChange(val);
    close();
  };

  const handleClearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <>
      <Field label={label} w={"full"}>
        <HStack
          w={"full"}
          p={PADDING_SM}
          px={PADDING_MD}
          border={"1px solid"}
          borderColor={"border.subtle"}
          rounded={theme.radii.component}
          justify={"space-between"}
          align={"center"}
          cursor={"pointer"}
          bg={"bg.body"}
          _hover={{
            bg: "bg.subtle",
          }}
          onClick={open}
        >
          <P
            fontSize={"sm"}
            color={selectedOption ? "fg.default" : "fg.subtle"}
            flex={1}
          >
            {selectedOption?.label ?? placeholder}
          </P>

          <HStack gap={SPACING_SM} align={"center"}>
            {value && (
              <Button
                variant={"ghost"}
                size={"xs"}
                p={1}
                minW={"auto"}
                h={"auto"}
                onClick={handleClearValue}
              >
                <AppIcon icon={XIcon} />
              </Button>
            )}
            <AppIcon icon={ChevronDownIcon} color={"fg.subtle"} />
          </HStack>
        </HStack>
      </Field>

      <Modal.Root
        modalKey={subModalKey}
        opened={isOpen}
        open={open}
        close={close}
        size={"sm"}
      >
        <Modal.Content>
          <Modal.Header>
            <P textAlign={"center"} fontWeight={"semibold"}>
              {`Pilih ${label}`}
            </P>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body gap={SPACING_SM} p={PADDING_MD}>
            <SearchInput
              placeholder={`Cari ${label}...`}
              onValueChange={setSearchQuery}
              w={"full"}
              autoFocus={true}
            />

            <VScrollContainer h={"280px"} w={"full"}>
              <VStack gap={1} w={"full"} mt={SPACING_SM}>
                {filteredOptions.length === 0 && (
                  <P
                    textAlign={"center"}
                    color={"fg.subtle"}
                    py={PADDING_MD}
                    fontSize={"sm"}
                  >
                    {"Pilihan tidak ditemukan"}
                  </P>
                )}

                {filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <HStack
                      key={opt.value}
                      w={"full"}
                      p={PADDING_SM}
                      px={PADDING_MD}
                      rounded={theme.radii.component}
                      justify={"space-between"}
                      align={"center"}
                      cursor={"pointer"}
                      bg={isSelected ? "bg.subtle" : undefined}
                      _hover={{ bg: "bg.subtle" }}
                      onClick={() => handleOptionClick(opt.value)}
                    >
                      <P
                        fontSize={"sm"}
                        fontWeight={isSelected ? "semibold" : "normal"}
                      >
                        {opt.label}
                      </P>
                      {isSelected && (
                        <AppIcon
                          icon={CheckIcon}
                          color={`${theme.colorPalette}.solid`}
                        />
                      )}
                    </HStack>
                  );
                })}
              </VStack>
            </VScrollContainer>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
