// src/design-system/components/overlay/types/modal.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Dialog as ChakraDialog,
  Drawer as ChakraDrawer,
} from "@chakra-ui/react";
import type { RefObject } from "react";

export type PopModalTriggerProps = ModalTriggerProps & {
  modalKey: string;
};

export type ModalRootProps = (
  | Omit<ChakraDrawer.RootProps, "open" | "placement">
  | Omit<ChakraDialog.RootProps, "open" | "placement">
) & {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  dialogClickOriginAnimation?: boolean;
  drawerPlacement?: ChakraDrawer.RootProps["placement"];
  drawerSwipeToDismiss?: boolean;
};

export type ModalTriggerProps = (
  | ChakraDrawer.TriggerProps
  | ChakraDialog.TriggerProps
) & {};

export type ModalBackdropProps = (
  | ChakraDrawer.BackdropProps
  | ChakraDialog.BackdropProps
) & {};

export type ModalContentProps = (
  | ChakraDrawer.ContentProps
  | ChakraDialog.ContentProps
) & {
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  backdrop?: boolean;
};

export type ModalCloseTriggerProps = (
  | ChakraDrawer.ContentProps
  | ChakraDialog.ContentProps
) & {};

export type ModalCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ModalCloseTriggerProps;
};

export type ModalHeaderProps = (
  | ChakraDrawer.HeaderProps
  | ChakraDialog.HeaderProps
) & {};

export type ModalBodyProps = (
  | ChakraDrawer.BodyProps
  | ChakraDialog.BodyProps
) & {};

export type ModalFooterProps = (
  | ChakraDrawer.FooterProps
  | ChakraDialog.FooterProps
) & {};
