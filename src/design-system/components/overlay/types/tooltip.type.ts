// src/design-system/components/overlay/types/tooltip.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import { Tooltip as ChakraTooltip } from "@chakra-ui/react";
import type { ReactNode, RefObject } from "react";

export type TooltipProps = ChakraTooltip.RootProps & {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  content: ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  asChild?: boolean;
  w?: BoxProps["w"];
  width?: BoxProps["width"];
};
