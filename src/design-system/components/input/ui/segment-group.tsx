// src/design-system/components/input/ui/segment-group.tsx

import type {
  SegmentGroupIndicatorProps,
  SegmentGroupItemHiddenInputProps,
  SegmentGroupItemProps,
  SegmentGroupItemTextProps,
  SegmentGroupRootProps,
} from "@/design-system/components/input/types/segment-group.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import { forwardRef } from "react";

const SegmentGroupRoot = forwardRef<HTMLDivElement, SegmentGroupRootProps>(
  function SegmentGroupRoot(props, ref) {
    const { theme } = useThemeStore();

    return (
      <ChakraSegmentGroup.Root
        ref={ref}
        colorPalette={theme.colorPalette}
        overflow={"clip"}
        minW={0}
        rounded={theme.radii.component}
        bg={"bg.subtle"}
        {...props}
      />
    );
  },
);

const SegmentGroupIndicator = forwardRef<
  HTMLDivElement,
  SegmentGroupIndicatorProps
>(function SegmentGroupIndicator(props, ref) {
  const { theme } = useThemeStore();

  return (
    <ChakraSegmentGroup.Indicator
      ref={ref}
      border={"1px solid"}
      bg={"bg.muted"}
      borderColor={"border.subtle"}
      rounded={theme.radii.component}
      {...props}
    />
  );
});

const SegmentGroupItem = forwardRef<HTMLLabelElement, SegmentGroupItemProps>(
  function SegmentGroupItem(props, ref) {
    return (
      <ChakraSegmentGroup.Item
        ref={ref}
        flex={1}
        minW={0}
        cursor={"pointer"}
        color={"fg.subtle"}
        _checked={{ color: "fg" }}
        {...props}
      />
    );
  },
);

const SegmentGroupItemText = forwardRef<
  HTMLSpanElement,
  SegmentGroupItemTextProps
>(function SegmentGroupItemText(props, ref) {
  return (
    <ChakraSegmentGroup.ItemText
      ref={ref}
      minW={0}
      overflow={"clip"}
      {...props}
    />
  );
});

const SegmentGroupItemHiddenInput = forwardRef<
  HTMLInputElement,
  SegmentGroupItemHiddenInputProps
>(function SegmentGroupItemHiddenInput(props, ref) {
  return <ChakraSegmentGroup.ItemHiddenInput ref={ref} {...props} />;
});

export const SegmentGroup = {
  Root: SegmentGroupRoot,
  Indicator: SegmentGroupIndicator,
  Item: SegmentGroupItem,
  ItemText: SegmentGroupItemText,
  ItemHiddenInput: SegmentGroupItemHiddenInput,
};
