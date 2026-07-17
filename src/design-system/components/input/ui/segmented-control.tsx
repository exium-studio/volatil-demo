// src/design-system/components/input/ui/segmented-control.tsx

import type { SegmentedControlProps } from "@/design-system/components/input/types/segmented-control.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import * as React from "react";

export const SegmentedControl = React.forwardRef<HTMLInputElement, SegmentedControlProps>(
  function SegmentedControl(props, ref) {
    // Props
    const { options, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraSegmentGroup.Root
        ref={ref}
        colorPalette={theme.colorPalette}
        {...restProps}
      >
        <ChakraSegmentGroup.Indicator />
        {options.map((option) => (
          <ChakraSegmentGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            cursor={"pointer"}
          >
            <ChakraSegmentGroup.ItemHiddenInput />
            <ChakraSegmentGroup.ItemText>{option.label}</ChakraSegmentGroup.ItemText>
          </ChakraSegmentGroup.Item>
        ))}
      </ChakraSegmentGroup.Root>
    );
  }
);
