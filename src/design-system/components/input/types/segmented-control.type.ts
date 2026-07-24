// src/design-system/components/input/types/segmented-control.type.ts

import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import type { ComponentType } from "react";

export type SegmentGroupInputOption = {
  value: string;
  label?: string;
  leftIcon?: ComponentType;
  rightIcon?: ComponentType;
  disabled?: boolean;
};

export type SegmentGroupInputProps = ChakraSegmentGroup.RootProps & {
  options: SegmentGroupInputOption[];
  itemProps?: Omit<ChakraSegmentGroup.ItemProps, "value">;
  colorPalette?: string;
};
