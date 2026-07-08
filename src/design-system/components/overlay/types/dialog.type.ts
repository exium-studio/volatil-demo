// src/design-system/components/overlay/types/dialog.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { Dialog as ChakraDialog } from "@chakra-ui/react";

export type DialogRootProps = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  clickOriginAnimation?: boolean;
} & Omit<ChakraDialog.RootProps, "open">;

export type DialogContentProps = {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  backdrop?: boolean;
} & ChakraDialog.ContentProps;

export type DialogCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ChakraDialog.CloseTriggerProps;
};
