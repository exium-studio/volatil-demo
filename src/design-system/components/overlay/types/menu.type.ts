// src/design-system/components/overlay/types/menu.type.ts

import { Menu as ChakraMenu } from "@chakra-ui/react";
import type { RefObject } from "react";

export type MenuRootProps = ChakraMenu.RootProps & {};

export type MenuTriggerProps = ChakraMenu.TriggerProps & {};

export type MenuContextTriggerProps = ChakraMenu.ContextTriggerProps & {};

export type MenuContentProps = ChakraMenu.ContentProps & {
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  positionerProps?: ChakraMenu.PositionerProps;
};

export type MenuItemProps = ChakraMenu.ItemProps & {};
