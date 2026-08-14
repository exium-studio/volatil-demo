// src/design-system/components/input/ui/select.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SelectProps } from "@/design-system/components/input/types/select.type";
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
            minW={0}
          >
            <HStack w={"full"} minW={0} justify={"space-between"}>
              <HStack>
                <ChakraSelect.ValueText
                  placeholder={placeholder}
                  minH={"20px"}
                />

                <P>{suffixLabel}</P>
              </HStack>

              <AppIcon
                icon={ChevronDownIcon}
                color={props?.color}
                mr={"-2px"}
              />
            </HStack>
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
