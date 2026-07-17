// src/design-system/components/overlay/types/popover.type.ts

import { Popover as ChakraPopover } from "@chakra-ui/react";
import type { RefObject } from "react";

export type PopoverRootProps = ChakraPopover.RootProps & {};

export type PopoverTriggerProps = ChakraPopover.TriggerProps & {};

export type PopoverPositionerProps = ChakraPopover.PositionerProps & {};

export type PopoverContentProps = ChakraPopover.ContentProps & {
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
};

export type PopoverArrowProps = ChakraPopover.ArrowProps & {};

export type PopoverArrowTipProps = ChakraPopover.ArrowTipProps & {};

export type PopoverCloseTriggerProps = ChakraPopover.CloseTriggerProps & {};

export type PopoverTitleProps = ChakraPopover.TitleProps & {};

export type PopoverDescriptionProps = ChakraPopover.DescriptionProps & {};

export type PopoverHeaderProps = ChakraPopover.HeaderProps & {};

export type PopoverBodyProps = ChakraPopover.BodyProps & {};

export type PopoverFooterProps = ChakraPopover.FooterProps & {};
