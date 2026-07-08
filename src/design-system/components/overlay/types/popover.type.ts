// src/design-system/components/overlay/types/popover.type.ts

import { Popover as ChakraPopover } from "@chakra-ui/react";

export type PopoverRootProps = {} & ChakraPopover.RootProps;

export type PopoverContentProps = {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
} & ChakraPopover.ContentProps;

export type PopoverArrowProps = {} & ChakraPopover.ArrowProps;

export type PopoverCloseTriggerProps = {} & ChakraPopover.CloseTriggerProps;

export type PopoverTitleProps = {} & ChakraPopover.TitleProps;

export type PopoverDescriptionProps = {} & ChakraPopover.DescriptionProps;

export type PopoverFooterProps = {} & ChakraPopover.FooterProps;

export type PopoverHeaderProps = {} & ChakraPopover.HeaderProps;

export type PopoverBodyProps = {} & ChakraPopover.BodyProps;

export type PopoverTriggerProps = {} & ChakraPopover.TriggerProps;
