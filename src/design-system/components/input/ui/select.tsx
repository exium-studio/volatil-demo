// src/design-system/components/input/ui/select.tsx

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
import { ChevronDownIcon } from "lucide-react";
import { isValidElement, useMemo } from "react";

const EMPTY_OPTIONS: SelectOption[] = [];

export default function SelectInput(props: SelectProps) {
  // Props
  const {
    value,
    onValueChange,
    options: optionsProp,
    selectOptions: deprecatedSelectOptions,
    placeholder = "Select option",
    size = "md",
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

  // Derived Values
  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  // States
  const collection = createListCollection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => String(item.value),
  });

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

  const renderTriggerContent = () => {
    if (typeof customTrigger === "function") {
      return customTrigger({
        selectedOption,
        value,
        placeholder,
        disabled,
      });
    }

    if (customTrigger) {
      return customTrigger;
    }

    return (
      <HStack w={"full"} minW={0} justify={"space-between"}>
        <HStack flex={1} minW={0} gap={2}>
          {renderStartElement(
            selectedOption?.startElement,
            selectedOption?.icon,
            "sm",
          )}

          <ChakraSelect.ValueText
            placeholder={placeholder}
            minH={"20px"}
            maxH={"20px"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            display={"inline-block"}
            minW={0}
            fontSize={props?.fontSize}
          />

          {suffixLabel && <P>{suffixLabel}</P>}
        </HStack>

        <AppIcon
          icon={ChevronDownIcon}
          color={props?.color}
          mr={"-2px"}
        />
      </HStack>
    );
  };

  return (
    <ChakraSelect.Root
      collection={collection}
      size={size}
      value={value ? [value] : undefined}
      colorPalette={"neutral"}
      disabled={disabled}
      onValueChange={(e) => {
        if (e.value[0]) {
          const matched = options.find(
            (opt) => String(opt.value) === String(e.value[0]),
          );
          onValueChange?.(e.value[0], matched);
        }
      }}
      {...restProps}
    >
      <ChakraSelect.HiddenSelect />

      <Tooltip
        content={
          <HStack>
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
              animation: "scale-up-overshoot",
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
                  <>
                    {renderStartElement(item.startElement, item.icon, "sm")}
                    {item.label}
                  </>
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
