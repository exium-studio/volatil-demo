// src/design-system/components/input/types/segmented-control.type.ts

import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import type { ComponentType } from "react";

export type SegmentedControlOption = {
  value: string;
  label?: string;
  leftIcon?: ComponentType;
  rightIcon?: ComponentType;
  disabled?: boolean;
};

export type SegmentedControlProps = ChakraSegmentGroup.RootProps & {
  options: SegmentedControlOption[];
  itemProps?: Omit<ChakraSegmentGroup.ItemProps, "value">;
  colorPalette?: string;
};
