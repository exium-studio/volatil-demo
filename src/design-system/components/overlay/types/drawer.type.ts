// src/design-system/components/overlay/types/drawer.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { Drawer as ChakraDrawer } from "@chakra-ui/react";
import type { RefObject } from "react";

export type DrawerRootProps = Omit<ChakraDrawer.RootProps, "open"> & {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  swipeToDismiss?: boolean;
};

export type DrawerContentProps = ChakraDrawer.ContentProps & {
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  backdrop?: boolean;
};

export type DrawerCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ChakraDrawer.CloseTriggerProps;
};

export type GestureMode = "drag" | "scroll" | null;

export type DrawerContextValue = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  fullscreen: boolean;
  setFullscreen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  swipeToDismiss: boolean;
  placement: ChakraDrawer.RootProps["placement"];
  size: ChakraDrawer.RootProps["size"];
  closeOnInteractOutside?: boolean;
};

