// src/design-system/components/overlay/types/modal.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Dialog as ChakraDialog,
  Drawer as ChakraDrawer,
} from "@chakra-ui/react";

export type PopModalTriggerProps = {
  modalKey: string;
} & ModalTriggerProps;

export type ModalRootProps = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  dialogClickOriginAnimation?: boolean;
  drawerPlacement?: ChakraDrawer.RootProps["placement"];
  drawerSwipeToDismiss?: boolean;
} & (
  | Omit<ChakraDrawer.RootProps, "open" | "placement">
  | Omit<ChakraDialog.RootProps, "open" | "placement">
);

export type ModalTriggerProps = {} & (
  | ChakraDrawer.TriggerProps
  | ChakraDialog.TriggerProps
);

export type ModalBackdropProps = {} & (
  | ChakraDrawer.BackdropProps
  | ChakraDialog.BackdropProps
);

export type ModalContentProps = {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  backdrop?: boolean;
} & (ChakraDrawer.ContentProps | ChakraDialog.ContentProps);

export type ModalCloseTriggerProps = {} & (
  | ChakraDrawer.ContentProps
  | ChakraDialog.ContentProps
);

export type ModalCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ModalCloseTriggerProps;
};

export type ModalHeaderProps = {} & (
  | ChakraDrawer.HeaderProps
  | ChakraDialog.HeaderProps
);

export type ModalBodyProps = {} & (
  | ChakraDrawer.BodyProps
  | ChakraDialog.BodyProps
);

export type ModalFooterProps = {} & (
  | ChakraDrawer.FooterProps
  | ChakraDialog.FooterProps
);
