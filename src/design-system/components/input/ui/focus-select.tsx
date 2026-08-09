// src/design-system/components/input/ui/focus-select.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import type { FocusSelectInputProps } from "@/design-system/components/input/types/focus-select.type";
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
    onValueChange?.(val);
    close();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onValueChange?.("");
  };

  const selectTriggerNode = (
    <Button
      variant={variant}
      size={size}
      w={w}
      justifyContent={"space-between"}
      alignItems={"center"}
      disabled={disabled}
      onClick={disabled ? undefined : open}
      fontWeight={"normal"}
      px={PADDING_MD}
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
        {clearable && currentValue && !disabled && (
          <IconButton
            variant={"ghost"}
            size={"xs"}
            aria-label={t["action.clear"]()}
            onClick={handleClear}
          >
            <AppIcon icon={XIcon} size={"sm"} />
          </IconButton>
        )}
        <AppIcon icon={ChevronDownIcon} size={"sm"} color={"fg.subtle"} />
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
        size={"sm"}
      >
        <Modal.Content>
          <Modal.Header>
            <P textAlign={"center"} fontWeight={"semibold"}>
              {label
                ? `${t["action.select"]()} ${label}`
                : t["common.select_option"]()}
            </P>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body p={0}>
            <VStack w={"full"} px={PADDING_MD} pt={"2px"}>
              <SearchInput
                placeholder={t["action.search"]()}
                onValueChange={setSearchQuery}
                w={"full"}
                autoFocus={true}
              />
            </VStack>

            <VScrollContainer
              w={"full"}
              // h={"280px"}
              p={PADDING_MD}
            >
              <VStack gap={1} w={"full"}>
                {filteredOptions.length === 0 && (
                  <P textAlign={"center"} color={"fg.subtle"} py={PADDING_MD}>
                    {t["common.no_data"]()}
                  </P>
                )}

                {filteredOptions.map((opt) => {
                  const isSelected = opt.value === currentValue;
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
                      onClick={() => handleOptionSelect(opt.value)}
                    >
                      <HStack gap={SPACING_SM} align={"center"} flex={1}>
                        {opt.icon && <AppIcon icon={opt.icon} size={"sm"} />}
                        <VStack align={"start"} gap={0}>
                          <P fontWeight={isSelected ? "semibold" : "normal"}>
                            {opt.label}
                          </P>
                          {opt.description && (
                            <P fontSize={"xs"} color={"fg.subtle"}>
                              {opt.description}
                            </P>
                          )}
                        </VStack>
                      </HStack>

                      {isSelected && (
                        <AppIcon
                          icon={CheckIcon}
                          size={"sm"}
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
}
