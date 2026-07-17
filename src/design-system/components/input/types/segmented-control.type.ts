// src/design-system/components/input/types/segmented-control.type.ts

import { SegmentGroup as ChakraSegmentGroup } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SegmentedControlOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = ChakraSegmentGroup.RootProps & {
  options: SegmentedControlOption[];
};
