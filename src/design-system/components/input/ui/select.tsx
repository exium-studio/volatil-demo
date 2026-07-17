// src/design-system/components/input/ui/select.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SelectProps } from "@/design-system/components/input/types/select.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  Select as ChakraSelect,
  Portal,
  createListCollection,
} from "@chakra-ui/react";

export default function SelectInput(props: SelectProps) {
  // Props
  const {
    value,
    onValueChange,
    selectOptions = [],
    placeholder = "Select option",
    size = "md",
    portalled = true,
    portalRef,
    suffixLabel,
    _hover,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const collection = createListCollection({
    items: selectOptions,
    itemToString: (item) => item.label,
    itemToValue: (item) => String(item.value),
  });

  return (
    <ChakraSelect.Root
      collection={collection}
      size={size}
      value={value ? [value] : undefined}
      colorPalette={"neutral"}
      onValueChange={(e) => {
        if (e.value[0]) {
          onValueChange?.(e.value[0]);
        }
      }}
      {...restProps}
    >
      <ChakraSelect.HiddenSelect />

      <Tooltip
        content={
          <HStack w={"200%"}>
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
          >
            <HStack w={"full"}>
              <ChakraSelect.ValueText
                fontSize={props?.fontSize}
                placeholder={placeholder}
                minH={"20px"}
              />
              {suffixLabel}
            </HStack>
          </ChakraSelect.Trigger>

          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator boxSize={5} color={props?.color} />
          </ChakraSelect.IndicatorGroup>
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
                {item.icon && <AppIcon icon={item.icon} />}

                {item.label}

                <ChakraSelect.ItemIndicator
                  color={`${theme.colorPalette}.solid`}
                />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
}
