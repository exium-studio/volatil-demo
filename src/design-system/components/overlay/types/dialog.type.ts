// src/design-system/components/overlay/types/dialog.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { Dialog as ChakraDialog } from "@chakra-ui/react";
import type { RefObject } from "react";

export type DialogRootProps = Omit<ChakraDialog.RootProps, "open"> & {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  clickOriginAnimation?: boolean;
};

export type DialogContentProps = ChakraDialog.ContentProps & {
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  backdrop?: boolean;
};

export type DialogCloseButtonProps = IconButtonProps & {
  closeTriggerProps?: ChakraDialog.CloseTriggerProps;
};

export type DialogContextValue = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  fullscreen: boolean;
  setFullscreen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  clickOriginAnimation: boolean;
  size: ChakraDialog.RootProps["size"];
  closeOnInteractOutside?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export type DialogAnimationState = {
  clickOrigin: Point;
  dialogOffset: Point;
};

export type DialogAnimationStore = {
  dialogs: Record<string, DialogAnimationState>;
  zIndexCounter: number;

  setClickOrigin: (modalKey: string, clickOrigin: Point) => void;
  setDialogOffset: (modalKey: string, dialogOffset: Point) => void;

  getClickOrigin: (modalKey: string) => Point;
  getDialogOffset: (modalKey: string) => Point;

  clear: (modalKey: string) => void;
};

