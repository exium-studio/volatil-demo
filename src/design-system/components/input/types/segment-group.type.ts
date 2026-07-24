// src/design-system/components/input/types/segment-group.type.ts

import type { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef } from "react";

export type SegmentGroupRootProps = ChakraSegmentGroup.RootProps & {};

export type SegmentGroupIndicatorProps = ChakraSegmentGroup.IndicatorProps & {};

export type SegmentGroupItemProps = ChakraSegmentGroup.ItemProps & {};

export type SegmentGroupItemTextProps = ChakraSegmentGroup.ItemTextProps & {};

export type SegmentGroupItemHiddenInputProps = ComponentPropsWithoutRef<
  typeof ChakraSegmentGroup.ItemHiddenInput
>;
