// src/design-system/components/input/ui/radio-input.tsx

import type { RadioInputProps } from "@/design-system/components/input/types/radio-input.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import * as React from "react";

export const RadioInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
  function RadioInput(props, ref) {
    // Props
    const { options, itemProps, itemControlProps, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraRadioGroup.Root
        ref={ref}
        colorPalette={theme.colorPalette}
        {...restProps}
      >
        <HStack wrap={"wrap"} gap={8}>
          {options.map((option) => (
            <ChakraRadioGroup.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              cursor={"pointer"}
              {...itemProps}
            >
              <ChakraRadioGroup.ItemHiddenInput />

              <ChakraRadioGroup.ItemIndicator {...itemControlProps} />

              <ChakraRadioGroup.ItemText>
                {option.label}
              </ChakraRadioGroup.ItemText>
            </ChakraRadioGroup.Item>
          ))}
        </HStack>
      </ChakraRadioGroup.Root>
    );
  },
);
