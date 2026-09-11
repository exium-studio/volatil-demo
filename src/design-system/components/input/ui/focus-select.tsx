// src/design-system/components/input/ui/focus-select.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  FieldContext,
  useFieldContextValue,
} from "@/design-system/components/input/context/field.context";
import type {
  FocusSelectInputProps,
  FocusSelectOption,
} from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { getFocusSelectIconSize } from "@/design-system/components/input/utils/focus-select.util";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

const SKELETON_LIST_COUNT = 5;

export function FocusSelectInput(props: FocusSelectInputProps) {
  // Props
  const {
    modalKey: modalKeyProp,
    label,
    title,
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

  const resolvedTitle = title ?? label;

  const resolvedModalKey = useMemo(
    () =>
      modalKeyProp ??
      `focus-select-${resolvedTitle ? resolvedTitle.toLowerCase().replace(/\s+/g, "-") : "option"}`,
    [modalKeyProp, resolvedTitle],
  );

  // Hooks
  const { isOpen, open, close } = usePopModal({
    modalKey: resolvedModalKey,
  });

  // Effects
  useEffect(() => {
    if (
      !isOpen &&
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, [isOpen]);

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

  const handleResetSelection = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onValueChange?.("", undefined);
    close();
  };

  // Contexts
  const fieldContext = useFieldContextValue();
  const isFloatingField = fieldContext?.variant === "floating";
  const floatingLabel = isFloatingField ? fieldContext?.label : undefined;
  const isOptional = fieldContext?.optional;
  const isLabelFloating = Boolean(currentValue) || isOpen;

  // Trigger Node
  const customTrigger = trigger ?? children;
  const iconSize = getFocusSelectIconSize(size);

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
        position={"relative"}
        alignItems={"center"}
        justifyContent={"space-between"}
        w={w}
        px={3}
        pr={clearable && currentValue && !disabled ? "60px" : "36px"}
        disabled={disabled}
        fontWeight={"normal"}
        data-has-value={currentValue ? "true" : "false"}
        {...(isFloatingField && {
          h: "60px",
          pt: floatingLabel ? "24px" : 0,
          pb: floatingLabel ? "2px" : 0,
        })}
        {...restProps}
      >
        {isFloatingField && floatingLabel && (
          <Box
            position={"absolute"}
            left={"12px"}
            top={"7px"}
            zIndex={1}
            pointerEvents={"none"}
            transform={isLabelFloating ? "translateY(0)" : "translateY(12px)"}
            transition={
              "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease"
            }
          >
            <HStack align={"center"} gap={2}>
              <ClampedP
                fontSize={isLabelFloating ? "xs" : "md"}
                fontWeight={"medium"}
                color={"fg.subtle"}
                transition={"font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1)"}
              >
                {floatingLabel}
              </ClampedP>

              {isOptional && (
                <Badge
                  size={"xs"}
                  fontSize={"2xs"}
                  colorPalette={"gray"}
                  color={"fg.subtle"}
                >
                  Optional
                </Badge>
              )}
            </HStack>
          </Box>
        )}

        <HStack gap={"sm"} flex={1} minW={0} justify={"start"}>
          {selectedOption?.icon && (
            <AppIcon icon={selectedOption.icon} size={iconSize} />
          )}

          <P
            color={selectedOption ? "fg.default" : "fg.subtle"}
            truncate
            data-placeholder={!selectedOption ? "true" : undefined}
            opacity={
              isFloatingField && floatingLabel && !selectedOption ? 0 : 1
            }
          >
            {selectedOption?.label ?? placeholder}
          </P>
        </HStack>

        <HStack
          gap={"sm"}
          position={"absolute"}
          right={3}
          top={"50%"}
          transform={"translateY(-50%)"}
          align={"center"}
          justify={"center"}
          pointerEvents={"auto"}
        >
          {clearable && currentValue && !disabled ? (
            <AppIcon
              icon={XIcon}
              size={iconSize}
              strokeWidth={2}
              cursor={"pointer"}
              _hover={{ color: "fg.default" }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleClear}
            />
          ) : (
            <AppIcon icon={ChevronDownIcon} size={iconSize} mr={"-2px"} />
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
      onExitComplete={() => {
        if (
          typeof document !== "undefined" &&
          document.activeElement instanceof HTMLElement
        ) {
          document.activeElement.blur();
        }
      }}
    >
      {triggerContent}

      <FieldContext.Provider value={null}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fontWeight={"semibold"}>
              {resolvedTitle
                ? resolvedTitle
                    .toLowerCase()
                    .startsWith(t["action.select"]().toLowerCase())
                  ? resolvedTitle
                  : `${t["action.select"]()} ${resolvedTitle}`
                : t["common.select_option"]()}
            </Modal.Title>

            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body p={0}>
            {/* Always render SearchInput when not fetching */}
            {!isFetching && (
              <VStack w={"full"} px={"md"} pt={"2px"} mb={"sm"}>
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
              <VStack w={"full"} px={"md"} mb={"sm"}>
                <Button
                  variant={
                    isCustomValueSelected && currentValue === searchQuery.trim()
                      ? "subtle"
                      : "outline"
                  }
                  w={"full"}
                  py={"sm"}
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
                  <HStack gap={"sm"} align={"center"} flex={1} minW={0}>
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
            <VScrollContainer w={"full"} maxH={"300px"} px={"md"} pb={"md"}>
              {isFetching ? (
                <VStack gap={"sm"} w={"full"}>
                  {Array.from({ length: SKELETON_LIST_COUNT }).map(
                    (_, index) => (
                      <Skeleton
                        key={`skeleton-${index + 1}`}
                        w={"full"}
                        h={"40px"}
                      />
                    ),
                  )}
                </VStack>
              ) : isEmptyArray(filteredOptions) ? (
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
                        minH={"40px"}
                        h={"max"}
                        px={3}
                        py={"xs"}
                        alignItems={"center"}
                        justifyContent={"start"}
                        onClick={() => handleOptionSelect(opt.value, opt)}
                      >
                        <HStack
                          gap={"sm"}
                          align={"center"}
                          flex={1}
                          minW={0}
                          justify={"start"}
                        >
                          {opt.icon && <AppIcon icon={opt.icon} size={"sm"} />}
                          <VStack align={"start"}>
                            <ClampedP
                              fontWeight={isSelected ? "semibold" : "normal"}
                              textAlign={"start"}
                            >
                              {opt.label}
                            </ClampedP>

                            {opt.description && (
                              <ClampedP
                                fontSize={"xs"}
                                textAlign={"start"}
                                color={"fg.subtle"}
                              >
                                {opt.description}
                              </ClampedP>
                            )}
                          </VStack>
                        </HStack>

                        {isSelected && (
                          <AppIcon
                            icon={CheckIcon}
                            color={`${theme.colorPalette}.fg`}
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

          <Modal.Footer>
            <Button
              variant={"ghost"}
              w={"full"}
              disabled={!currentValue}
              onClick={handleResetSelection}
            >
              {t["action.reset"]()}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </FieldContext.Provider>
    </Modal.Root>
  );
}
