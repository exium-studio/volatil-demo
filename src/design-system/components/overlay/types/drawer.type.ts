// src/design-system/components/overlay/types/drawer.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { Drawer as ChakraDrawer } from "@chakra-ui/react";

export type DrawerRootProps = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  swipeToDismiss?: boolean;
} & Omit<ChakraDrawer.RootProps, "open">;

export type DrawerContentProps = {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  backdrop?: boolean;
} & ChakraDrawer.ContentProps;

export type DrawerCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ChakraDrawer.CloseTriggerProps;
};
