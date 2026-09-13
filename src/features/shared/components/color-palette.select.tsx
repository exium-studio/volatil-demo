// src/features/shared/components/color-palette.select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type { SelectOption } from "@/design-system/components/input/types/select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import SelectInput from "@/design-system/components/input/ui/select";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { COLOR_PALETTES_LIST } from "@/design-system/constants/colors";
import type { ColorPaletteSelectProps } from "@/features/shared/types/color-palette-select.type";
import { useMemo } from "react";

export const ColorPaletteSelect = (props: ColorPaletteSelectProps) => {
  // Props
  const {
    value,
    defaultValue = "blue",
    onValueChange,
    selectMode = "default",
    placeholder = "Pilih Color Palette",
    modalKey = "color-palette-select-modal",
    size = "sm",
    width,
    w = "full",
    disabled = false,
    clearable = false,
  } = props;

  // Derived Values
  const focusOptions = useMemo<FocusSelectOption[]>(() => {
    return COLOR_PALETTES_LIST.map((c) => ({
      label: c.label,
      value: c.palette,
      description: c.palette,
      startElement: (
        <Box
          boxSize={3.5}
          rounded={"full"}
          bg={c.primaryHex}
          flexShrink={0}
          border={"1px solid"}
          borderColor={"blackAlpha.200"}
        />
      ),
    }));
  }, []);

  const standardSelectOptions = useMemo<SelectOption[]>(() => {
    return COLOR_PALETTES_LIST.map((c) => ({
      value: c.palette,
      label: c.label,
      startElement: (
        <Box
          boxSize={3}
          rounded={"full"}
          bg={c.primaryHex}
          flexShrink={0}
          border={"1px solid"}
          borderColor={"blackAlpha.200"}
        />
      ),
    }));
  }, []);

  const currentValue = value ?? defaultValue;

  if (selectMode === "focus") {
    return (
      <FocusSelectInput
        modalKey={modalKey}
        title={placeholder}
        placeholder={placeholder}
        options={focusOptions}
        value={currentValue}
        onValueChange={(val) => onValueChange?.(val ?? defaultValue)}
        size={size}
        w={width ?? w}
        disabled={disabled}
        clearable={clearable}
        renderOption={(opt) => {
          const colorMeta = COLOR_PALETTES_LIST.find(
            (c) => c.palette === opt.value,
          );
          return (
            <HStack
              gap={2}
              align={"center"}
              flex={1}
              minW={0}
              justify={"start"}
            >
              <Box
                boxSize={3.5}
                rounded={"full"}
                bg={colorMeta?.primaryHex}
                flexShrink={0}
                border={"1px solid"}
                borderColor={"blackAlpha.200"}
              />
              <P fontSize={"sm"}>{opt.label}</P>
            </HStack>
          );
        }}
      />
    );
  }

  return (
    <SelectInput
      value={currentValue}
      onValueChange={(val) => onValueChange?.(val)}
      options={standardSelectOptions}
      placeholder={placeholder}
      size={size}
      width={width ?? w}
      disabled={disabled}
      renderOption={(item) => {
        const colorMeta = COLOR_PALETTES_LIST.find(
          (c) => c.palette === item.value,
        );
        return (
          <HStack gap={2} align={"center"} flex={1} minW={0}>
            <Box
              boxSize={3}
              rounded={"full"}
              bg={colorMeta?.primaryHex}
              flexShrink={0}
              border={"1px solid"}
              borderColor={"blackAlpha.200"}
            />
            <P fontSize={"sm"}>{item.label}</P>
          </HStack>
        );
      }}
    />
  );
};
