// src\design-system\components\input\ui\select.tsx

// src\design-system\components\input\ui\select.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  SelectOption,
  SelectProps,
} from "@/design-system/components/input/types/select.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  Select as ChakraSelect,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type React from "react";
import { isValidElement, useMemo, useState } from "react";

const EMPTY_OPTIONS: SelectOption[] = [];

export default function SelectInput(props: SelectProps) {
  // Props
  const {
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    options: optionsProp,
    selectOptions: deprecatedSelectOptions,
    placeholder = "Select option",
    clearable = true,
    size = "md",
    iconSize = "md",
    portalled = true,
    portalRef,
    suffixLabel,
    trigger: customTrigger,
    renderOption,
    _hover,
    disabled = false,
    ...restProps
  } = props;

  const options = optionsProp ?? deprecatedSelectOptions ?? EMPTY_OPTIONS;

  // Stores
  const { theme } = useThemeStore();

  // States (Controlled & Uncontrolled support)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Derived Values
  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(currentValue));
  }, [options, currentValue]);

  // States
  const collection = createListCollection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => String(item.value),
  });

  // Handlers
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onValueChange?.("", undefined);
  };

  const renderStartElement = (
    element?: React.ReactNode | React.ComponentType,
    iconFallback?: React.ComponentType,
    iconSize: "xs" | "sm" | "md" | "lg" | "xl" = "sm",
  ) => {
    const target = element ?? iconFallback;
    if (!target) return null;
    if (isValidElement(target)) return target;
    if (typeof target === "function") {
      const Component = target as React.ComponentType;
      return <AppIcon icon={Component} size={iconSize} />;
    }
    return <>{target}</>;
  };

  const hasValue = Boolean(currentValue);

  const renderTriggerContent = () => {
    if (typeof customTrigger === "function") {
      return customTrigger({
        selectedOption,
        value: currentValue,
        placeholder,
        disabled,
        clearable,
        handleClear,
      });
    }

    if (customTrigger) {
      return customTrigger;
    }

    return (
      <HStack w={"full"} minW={0} justify={"space-between"} align={"center"}>
        <HStack flex={1} minW={0} gap={2} align={"center"}>
          {renderStartElement(
            selectedOption?.startElement,
            selectedOption?.icon,
            "sm",
          )}

          <ChakraSelect.ValueText
            placeholder={placeholder}
            minH={"20px"}
            maxH={"20px"}
            lineHeight={"20px"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            display={"inline-block"}
            minW={0}
            fontSize={props?.fontSize}
          />

          {suffixLabel && <P>{suffixLabel}</P>}
        </HStack>

        <HStack
          gap={"sm"}
          align={"center"}
          justify={"center"}
          pointerEvents={"auto"}
        >
          {clearable && hasValue && !disabled ? (
            <AppIcon
              icon={XIcon}
              size={iconSize}
              strokeWidth={2}
              cursor={"pointer"}
              color={props?.color ?? "fg"}
              mr={"-2px"}
              _hover={{ color: "fg" }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleClear}
            />
          ) : (
            <AppIcon
              icon={ChevronDownIcon}
              size={iconSize}
              color={props?.color ?? "fg"}
              mr={"-2px"}
            />
          )}
        </HStack>
      </HStack>
    );
  };

  return (
    <ChakraSelect.Root
      collection={collection}
      size={size}
      value={currentValue ? [currentValue] : []}
      colorPalette={"neutral"}
      disabled={disabled}
      onValueChange={(e) => {
        const nextVal = e.value[0] ?? "";
        if (!isControlled) {
          setInternalValue(nextVal);
        }
        const matched = options.find(
          (opt) => String(opt.value) === String(nextVal),
        );
        onValueChange?.(nextVal, matched);
      }}
      {...restProps}
    >
      <ChakraSelect.HiddenSelect />

      <Tooltip
        content={
          <HStack align={"center"} gap={2}>
            {renderStartElement(
              selectedOption?.startElement,
              selectedOption?.icon,
              "sm",
            )}
            <ChakraSelect.ValueText
              fontSize={"sm"}
              placeholder={placeholder}
              whiteSpace={"nowrap"}
            />
            {suffixLabel}
          </HStack>
        }
      >
        <ChakraSelect.Control rounded={theme.radii.component} _hover={_hover}>
          <ChakraSelect.Trigger
            rounded={theme.radii.component}
            cursor={"pointer"}
            minW={0}
          >
            {renderTriggerContent()}
          </ChakraSelect.Trigger>
        </ChakraSelect.Control>
      </Tooltip>

      <Portal container={portalRef} disabled={!portalled}>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content
            gap={1}
            minW={"80px"}
            bg={"bg.body"}
            rounded={theme?.radii.container}
            border={"1px solid {colors.border.subtle}"}
            shadow={"sm"}
            _open={{
              animation: "scale-up",
              animationDuration: "slow",
            }}
            _closed={{
              animation: "scale-down",
              animationDuration: "moderate",
            }}
          >
            {collection.items.map((item) => (
              <ChakraSelect.Item
                key={String(item.value)}
                item={item}
                gap={2}
                p={2}
                rounded={theme?.radii.component}
                fontSize={restProps.fontSize}
                cursor={"pointer"}
                transition={"200ms"}
                _hover={{
                  bg: "bg.subtle",
                }}
                _selected={{
                  bg: "bg.muted",
                }}
              >
                {renderOption ? (
                  renderOption(item)
                ) : (
                  <HStack gap={2} align={"center"} flex={1} minW={0}>
                    {renderStartElement(item.startElement, item.icon, "sm")}
                    {item.label}
                  </HStack>
                )}

                <ChakraSelect.ItemIndicator
                  color={`${theme.colorPalette}.fg`}
                />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
}
