// src/design-system/components/overlay/ui/modal.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import type { DialogRootProps } from "@/design-system/components/overlay/types/dialog.type";
import type {
  ModalBackdropProps,
  ModalBodyProps,
  ModalCloseButtonProps,
  ModalCloseTriggerProps,
  ModalContentProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalRootProps,
  ModalTriggerProps,
} from "@/design-system/components/overlay/types/modal.type";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { Drawer } from "@/design-system/components/overlay/ui/drawer";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { type DrawerRootProps } from "@chakra-ui/react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type ModalContextValue = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  fullscreen: boolean;
  setFullscreen: Dispatch<SetStateAction<boolean>>;
  isSmallViewport: boolean;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModalContext must be used within Modal.Root");
  }

  return context;
}

// ---------------------------------------------------------------------------

const ModalRoot = (props: ModalRootProps) => {
  // Props
  const {
    children,
    modalKey,
    opened = false,
    open,
    close,
    size = "xs",
    dialogClickOriginAnimation = true,
    drawerPlacement = "bottom",
    drawerSwipeToDismiss = true,
    ...restProps
  } = props;

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // States
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      modalKey,
      opened,
      open,
      close,
      fullscreen,
      setFullscreen,
      isSmallViewport,
    }),
    [modalKey, opened, open, close, fullscreen, setFullscreen, isSmallViewport],
  );
  return (
    <ModalContext.Provider value={contextValue}>
      {isSmallViewport ? (
        <Drawer.Root
          modalKey={modalKey}
          opened={opened}
          open={open}
          close={close}
          size={size as DrawerRootProps["size"]}
          swipeToDismiss={drawerSwipeToDismiss}
          {...restProps}
          placement={drawerPlacement}
        >
          {children}
        </Drawer.Root>
      ) : (
        <Dialog.Root
          modalKey={modalKey}
          opened={opened}
          open={open}
          close={close}
          clickOriginAnimation={dialogClickOriginAnimation}
          size={size as DialogRootProps["size"]}
          {...restProps}
        >
          {children}
        </Dialog.Root>
      )}
    </ModalContext.Provider>
  );
};

const ModalTrigger = (props: ModalTriggerProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Trigger asChild {...props} />;
  }

  return <Dialog.Trigger asChild {...props} />;
};

const ModalBackdrop = (props: ModalBackdropProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Backdrop {...props} />;
  }

  return <Dialog.Backdrop {...props} />;
};

const ModalContent = (props: ModalContentProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Content {...props} />;
  }

  return <Dialog.Content {...props} />;
};

const ModalFullscreenButton = (props: IconButtonProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.FullscreenButton {...props} />;
  }

  return <Dialog.FullscreenButton {...props} />;
};

const ModalCloseTrigger = (props: ModalCloseTriggerProps) => {
  // Props
  const { pos, position, ...restProps } = props;

  // Contexts
  const { isSmallViewport } = useModalContext();

  const resolvedPos = pos ?? position;

  if (isSmallViewport) {
    return <Drawer.CloseTrigger asChild pos={resolvedPos} {...restProps} />;
  }

  return <Dialog.CloseTrigger asChild pos={resolvedPos} {...restProps} />;
};

const ModalCloseButton = (props: ModalCloseButtonProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.CloseButton {...props} />;
  }
  return <Dialog.CloseButton {...props} />;
};

const ModalHeader = (props: ModalHeaderProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Header {...props} />;
  }

  return <Dialog.Header {...props} />;
};

const ModalBody = (props: ModalBodyProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Body {...props} />;
  }

  return <Dialog.Body {...props} />;
};

const ModalFooter = (props: ModalFooterProps) => {
  // Contexts
  const { isSmallViewport } = useModalContext();

  if (isSmallViewport) {
    return <Drawer.Footer {...props} />;
  }

  return <Dialog.Footer {...props} />;
};

export const Modal = {
  Trigger: ModalTrigger,
  Root: ModalRoot,
  Backdrop: ModalBackdrop,
  Content: ModalContent,
  FullscreenButton: ModalFullscreenButton,
  CloseTrigger: ModalCloseTrigger,
  CloseButton: ModalCloseButton,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
};
