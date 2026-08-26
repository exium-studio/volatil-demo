// src/design-system/components/input/ui/focus-select.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  FocusSelectInputProps,
  FocusSelectOption,
} from "@/design-system/components/input/types/focus-select.type";
import { Field } from "@/design-system/components/input/ui/field";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

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
    isFetching = false,
    customOption = false,
    size = "md",
    variant = "outline",
    w = "full",
    trigger,
    children,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // States (Uncontrolled & Controlled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Derived Values
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const resolvedModalKey = useMemo(
    () =>
      modalKeyProp ??
      `focus-select-${label ? label.toLowerCase().replace(/\s+/g, "-") : "option"}`,
    [modalKeyProp, label],
  );

  // Hooks
  const { isOpen, open, close } = usePopModal({
    modalKey: resolvedModalKey,
  });

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    const found = options.find((opt) => opt.value === currentValue);
    if (found) return found;
    if (currentValue) {
      return { label: currentValue, value: currentValue };
    }
    return undefined;
  }, [options, currentValue]);

  // Handlers
  const handleOptionSelect = (
    val: string,
    optionDetail?: FocusSelectOption,
  ) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    const selectedOpt = optionDetail ??
      filteredOptions.find((opt) => opt.value === val) ?? {
        label: val,
        value: val,
      };
    onValueChange?.(val, selectedOpt);
    close();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onValueChange?.("", undefined);
  };

  // Trigger Node
  const customTrigger = trigger ?? children;

  const renderTrigger = () => {
    if (typeof customTrigger === "function") {
      return customTrigger({
        selectedOption,
        value: currentValue,
        placeholder,
        disabled,
        clearable,
        isOpen,
        open,
        close,
        handleClear,
      });
    }

    if (customTrigger) {
      return customTrigger;
    }

    return (
      <Button
        variant={variant}
        size={size}
        alignItems={"center"}
        justifyContent={"space-between"}
        w={w}
        px={3}
        disabled={disabled}
        fontWeight={"normal"}
        {...restProps}
      >
        <HStack gap={SPACING.sm} flex={1} minW={0} justify={"start"}>
          {selectedOption?.icon && (
            <AppIcon icon={selectedOption.icon} size={"sm"} />
          )}
          <P color={selectedOption ? "fg.default" : "fg.subtle"} truncate>
            {selectedOption?.label ?? placeholder}
          </P>
        </HStack>

        <HStack gap={SPACING.sm} align={"center"}>
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
  };

  const triggerContent = (
    <Modal.Trigger asChild disabled={disabled}>
      {renderTrigger()}
    </Modal.Trigger>
  );

  const isCustomValueSelected =
    Boolean(currentValue) && !options.some((opt) => opt.value === currentValue);

  return (
    <Modal.Root
      modalKey={resolvedModalKey}
      opened={isOpen}
      open={open}
      close={close}
    >
      {label ? (
        <Field label={label} w={w}>
          {triggerContent}
        </Field>
      ) : (
        triggerContent
      )}

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
          {/* Always render SearchInput when not fetching */}
          {!isFetching && (
            <VStack w={"full"} px={SPACING.md} pt={"2px"} mb={SPACING.sm}>
              <SearchInput
                placeholder={t["action.search"]()}
                onValueChange={setSearchQuery}
                w={"full"}
                autoFocus={true}
              />
            </VStack>
          )}

          {/* Always render Custom Option at top if customOption prop is true */}
          {customOption && !isFetching && (
            <VStack w={"full"} px={SPACING.md} mb={SPACING.sm}>
              <Button
                variant={
                  isCustomValueSelected && currentValue === searchQuery.trim()
                    ? "subtle"
                    : "outline"
                }
                w={"full"}
                py={SPACING.sm}
                px={3}
                justifyContent={"space-between"}
                alignItems={"center"}
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleOptionSelect(searchQuery.trim(), {
                      label: searchQuery.trim(),
                      value: searchQuery.trim(),
                      description: "Opsi kustom",
                    });
                  }
                }}
                disabled={!searchQuery.trim()}
              >
                <HStack gap={SPACING.sm} align={"center"} flex={1} minW={0}>
                  <AppIcon icon={PlusIcon} size={"sm"} />
                  <ClampedP>
                    {searchQuery.trim()
                      ? searchQuery.trim()
                      : "Ketik di atas untuk input kustom..."}
                  </ClampedP>
                </HStack>
                <Badge>Opsi Kustom</Badge>
              </Button>
            </VStack>
          )}

          {/* Clean options list container */}
          <VScrollContainer
            w={"full"}
            maxH={"300px"}
            px={SPACING.md}
            pb={SPACING.md}
          >
            {isFetching ? (
              <VStack gap={SPACING.sm} w={"full"}>
                {Array.from({ length: SKELETON_LIST_COUNT }).map((_, index) => (
                  <Skeleton
                    key={`skeleton-${index + 1}`}
                    w={"full"}
                    h={"40px"}
                  />
                ))}
              </VStack>
            ) : filteredOptions.length === 0 ? (
              <NoResultState query={searchQuery || "..."} />
            ) : (
              <VStack gap={1} w={"full"}>
                {filteredOptions.map((opt) => {
                  const isSelected = opt.value === currentValue;

                  return (
                    <Button
                      key={opt.value}
                      variant={isSelected ? "subtle" : "ghost"}
                      w={"full"}
                      py={SPACING.sm}
                      px={3}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      fontWeight={"normal"}
                      onClick={() => handleOptionSelect(opt.value, opt)}
                    >
                      <HStack
                        gap={SPACING.sm}
                        align={"center"}
                        flex={1}
                        minW={0}
                        justify={"start"}
                      >
                        {opt.icon && <AppIcon icon={opt.icon} size={"sm"} />}
                        <VStack align={"start"} gap={0} minW={0} flex={1}>
                          <ClampedP
                            fontWeight={isSelected ? "semibold" : "normal"}
                          >
                            {opt.label}
                          </ClampedP>

                          {opt.description && (
                            <ClampedP fontSize={"xs"} color={"fg.subtle"}>
                              {opt.description}
                            </ClampedP>
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
              </VStack>
            )}
          </VScrollContainer>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
