// src/design-system/components/input/ui/segmented-control.tsx

import type { SegmentedControlProps } from "@/design-system/components/input/types/segmented-control.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import * as React from "react";

export const SegmentedControl = React.forwardRef<
  HTMLInputElement,
  SegmentedControlProps
>(function SegmentedControl(props, ref) {
  // Props
  const { options, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraSegmentGroup.Root
      ref={ref}
      colorPalette={theme.colorPalette}
      rounded={theme.radii.component}
      minW={0}
      {...restProps}
    >
      <ChakraSegmentGroup.Indicator
        border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.component}
      />

      {options.map((option) => (
        <ChakraSegmentGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          cursor={"pointer"}
          flex={1}
          minW={0}
        >
          <ChakraSegmentGroup.ItemHiddenInput />

          <ChakraSegmentGroup.ItemText
            minW={0}
            overflow={"clip"}
            color={"fg.subtle"}
            _checked={{ color: "fg" }}
          >
            <ClampedP>{option.label}</ClampedP>
          </ChakraSegmentGroup.ItemText>
        </ChakraSegmentGroup.Item>
      ))}
    </ChakraSegmentGroup.Root>
  );
});
