// src/design-system/components/overlay/types/tooltip.type.ts

import { Tooltip as ChakraTooltip } from "@chakra-ui/react";

export type TooltipProps = {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
} & ChakraTooltip.RootProps;
