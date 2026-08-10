// src/design-system/components/input/ui/focus-select.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectInputProps } from "@/design-system/components/input/types/focus-select.type";
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
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

const MIN_SEARCHABLE_OPTIONS_COUNT = 8;
const SKELETON_LIST_COUNT = 5;

export function FocusSelectInput(props: FocusSelectInputProps) {
  // Props
  const {
    modalKey: modalKeyProp,
    label,
    placeholder = t["action.select"](),
    options = [],
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    disabled = false,
    clearable = true,
    parentModalKey,
    isFetching = false,
    size = "md",
    variant = "outline",
    w = "full",
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // States (Uncontrolled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isSearchable = options.length > MIN_SEARCHABLE_OPTIONS_COUNT;

  const generatedKey = useMemo(
    () =>
      modalKeyProp ??
      `focus-select-${label ? label.toLowerCase().replace(/\s+/g, "-") : "option"}`,
    [modalKeyProp, label],
  );

  const resolvedModalKey = parentModalKey
    ? `${parentModalKey}.${generatedKey}`
    : generatedKey;

  // Hooks
  const { isOpen, open, close } = usePopModal({
    modalKey: resolvedModalKey,
  });

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  );

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [options, searchQuery],
  );

  // Handlers
  const handleOptionSelect = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    const selectedOpt = options.find((opt) => opt.value === val);
    onValueChange?.(val, selectedOpt);
    close();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onValueChange?.("", undefined);
  };

  const selectTriggerNode = (
    <Button
      variant={variant}
      size={size}
      alignItems={"center"}
      justifyContent={"space-between"}
      w={w}
      px={3}
      disabled={disabled}
      fontWeight={"normal"}
      onClick={disabled ? undefined : open}
      {...restProps}
    >
      <HStack gap={SPACING_SM} flex={1} minW={0} justify={"start"}>
        {selectedOption?.icon && (
          <AppIcon icon={selectedOption.icon} size={"sm"} />
        )}
        <P color={selectedOption ? "fg.default" : "fg.subtle"} truncate>
          {selectedOption?.label ?? placeholder}
        </P>
      </HStack>

      <HStack gap={SPACING_SM} align={"center"}>
        {clearable && currentValue && !disabled ? (
          <AppIcon
            icon={XIcon}
            size={"sm"}
            strokeWidth={2}
            cursor={"pointer"}
            _hover={{ color: "fg.default" }}
            onClick={handleClear}
          />
        ) : (
          <AppIcon icon={ChevronDownIcon} mr={"-2px"} />
        )}
      </HStack>
    </Button>
  );

  return (
    <>
      {label ? (
        <Field label={label} w={w}>
          {selectTriggerNode}
        </Field>
      ) : (
        selectTriggerNode
      )}

      <Modal.Root
        modalKey={resolvedModalKey}
        opened={isOpen}
        open={open}
        close={close}
      >
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fontWeight={"semibold"}>
              {label
                ? `${t["action.select"]()} ${label}`
                : t["common.select_option"]()}
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body p={0}>
            {isSearchable && !isFetching && (
              <VStack w={"full"} px={PADDING_MD} pt={"2px"} mb={SPACING_SM}>
                <SearchInput
                  placeholder={t["action.search"]()}
                  onValueChange={setSearchQuery}
                  w={"full"}
                  autoFocus={true}
                />
              </VStack>
            )}

            <VScrollContainer w={"full"} px={PADDING_MD} pb={PADDING_MD}>
              <VStack gap={1} w={"full"}>
                {isFetching ? (
                  Array.from({ length: SKELETON_LIST_COUNT }).map(
                    (_, index) => (
                      <Skeleton
                        key={`skeleton-${index + 1}`}
                        w={"full"}
                        h={"40px"}
                      />
                    ),
                  )
                ) : (
                  <>
                    {filteredOptions.length === 0 && (
                      <NoResultState query={searchQuery || "..."} />
                    )}

                    {filteredOptions.map((opt) => {
                      const isSelected = opt.value === currentValue;
                      return (
                        <Button
                          key={opt.value}
                          variant={isSelected ? "subtle" : "ghost"}
                          w={"full"}
                          h={"auto"}
                          py={PADDING_SM}
                          px={3}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          fontWeight={"normal"}
                          onClick={() => handleOptionSelect(opt.value)}
                        >
                          <HStack
                            gap={SPACING_SM}
                            align={"center"}
                            flex={1}
                            minW={0}
                            justify={"start"}
                          >
                            {opt.icon && (
                              <AppIcon icon={opt.icon} size={"sm"} />
                            )}
                            <VStack align={"start"} gap={0} minW={0} flex={1}>
                              <P
                                fontWeight={isSelected ? "semibold" : "normal"}
                                truncate
                              >
                                {opt.label}
                              </P>

                              {opt.description && (
                                <P fontSize={"xs"} color={"fg.subtle"} truncate>
                                  {opt.description}
                                </P>
                              )}
                            </VStack>
                          </HStack>

                          {isSelected && (
                            <AppIcon
                              icon={CheckIcon}
                              color={`${theme.colorPalette}.solid`}
                              mr={"-2px"}
                            />
                          )}
                        </Button>
                      );
                    })}
                  </>
                )}
              </VStack>
            </VScrollContainer>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
