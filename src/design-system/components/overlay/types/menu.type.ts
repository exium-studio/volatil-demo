// src/design-system/components/overlay/types/menu.type.ts

import { Menu as ChakraMenu } from "@chakra-ui/react";

export type MenuRootProps = {} & ChakraMenu.RootProps;

export type MenuTriggerProps = {} & ChakraMenu.TriggerProps;

export type MenuContextTriggerProps = {} & ChakraMenu.ContextTriggerProps;

export type MenuContentProps = {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  positionerProps?: ChakraMenu.PositionerProps;
} & ChakraMenu.ContentProps;

export type MenuItemProps = {} & ChakraMenu.ItemProps;
