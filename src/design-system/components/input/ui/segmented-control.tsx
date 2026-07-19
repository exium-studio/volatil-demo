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
      overflow={"clip"}
      minW={0}
      rounded={theme.radii.component}
      bg={"bg.subtle"}
      {...restProps}
    >
      <ChakraSegmentGroup.Indicator
        border={"1px solid"}
        bg={"bg.muted"}
        borderColor={"border.subtle"}
        rounded={theme.radii.component}
      />

      {options.map((option) => (
        <ChakraSegmentGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          flex={1}
          minW={0}
          cursor={"pointer"}
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
