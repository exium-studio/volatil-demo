// src/design-system/components/overlay/ui/dialog.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  DIALOG_OFFSET_X_VAR,
  DIALOG_OFFSET_Y_VAR,
  getDialogOffset,
  updateClickOrigin,
  updateDialogOffset,
} from "@/design-system/components/overlay/stores/use-dialog-animation-store";
import type {
  DialogCloseButtonProps,
  DialogContentProps,
  DialogRootProps,
} from "@/design-system/components/overlay/types/dialog.type";
import {
  registerFullscreenAnimator,
  triggerFullscreenAnimation,
  unregisterFullscreenAnimator,
} from "@/design-system/components/overlay/utils/fullscreen-animation-registry";
import { Portal } from "@/design-system/components/utilities/portal";
import { MODAL_BASE_ZINDEX } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { back } from "@/shared/utils/client/navigation";
import { Dialog as ChakraDialog } from "@chakra-ui/react";
import { IconSquare, IconSquares, IconX } from "@tabler/icons-react";
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type DialogContextValue = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  clickOriginAnimation: boolean;
  size: ChakraDialog.RootProps["size"];
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialogContext must be used within Dialog.Root");
  }

  return context;
}

// ---------------------------------------------------------------------------

const DialogRoot = (props: DialogRootProps) => {
  // Props
  const {
    modalKey = "dialog",
    opened = false,
    open,
    close,
    clickOriginAnimation = true,
    size = "xs",
    ...restProps
  } = props;

  // Derived Values
  const nestingLevel = modalKey.split(".").length;
  const isNested = nestingLevel > 1;
  const delayMs = nestingLevel;

  // States
  const [delayedOpened, setDelayedOpened] = useState(() =>
    isNested && opened ? false : opened,
  );
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useFirstMountEffect(
    {
      onFirstMount: () => {
        if (!isNested || !opened) return;

        const timeoutId = setTimeout(() => {
          setDelayedOpened(true);
        }, delayMs);

        return () => clearTimeout(timeoutId);
      },
      onUpdate: () => {
        setDelayedOpened(opened);
      },
    },
    [opened, isNested, delayMs],
  );

  const contextValue = useMemo<DialogContextValue>(
    () => ({
      modalKey,
      opened,
      open,
      close,
      clickOriginAnimation,
      fullscreen,
      setFullscreen,
      size,
    }),
    [
      modalKey,
      opened,
      open,
      close,
      clickOriginAnimation,
      fullscreen,
      setFullscreen,
      size,
    ],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      <ChakraDialog.Root
        open={delayedOpened}
        lazyMount
        unmountOnExit
        size={fullscreen ? "full" : size}
        scrollBehavior={"inside"}
        {...restProps}
        placement={"center"}
        trapFocus={false}
        preventScroll
        onEscapeKeyDown={() => {
          back();
        }}
      />
    </DialogContext.Provider>
  );
};

const DialogTrigger = (props: ChakraDialog.TriggerProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { modalKey, open, clickOriginAnimation } = useDialogContext();

  // Handlers
  const initOriginPoint = clickOriginAnimation
    ? (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateClickOrigin(modalKey, e.currentTarget);
      }
    : undefined;

  return (
    <ChakraDialog.Trigger
      asChild
      onPointerDown={initOriginPoint}
      onClick={(event) => {
        open?.();
        onClick?.(event);
      }}
      {...restProps}
    />
  );
};

const DialogPositioner = (props: ChakraDialog.PositionerProps) => {
  return <ChakraDialog.Positioner {...props} />;
};

const DialogBackdrop = (props: ChakraDialog.BackdropProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { close } = useDialogContext();

  return (
    <ChakraDialog.Backdrop
      pointerEvents={"auto"}
      onClick={(event) => {
        if (close) {
          close();
        } else {
          back();
        }
        onClick?.(event);
      }}
      {...restProps}
    />
  );
};

const DialogContent = (props: DialogContentProps) => {
  // Props
  const { portalled = true, portalRef, backdrop = true, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { modalKey, fullscreen, size, clickOriginAnimation } =
    useDialogContext();

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Derived Values
  const isFullscreen = fullscreen || size === "full";
  const zIndex = MODAL_BASE_ZINDEX + modalKey.split(".").length;

  useLayoutEffect(() => {
    let currentAnimation: Animation | null = null;

    registerFullscreenAnimator(modalKey, (next) => {
      const el = contentRef.current;
      if (!el) return;

      // cancel fullscreen animation
      // currentAnimation?.cancel();

      currentAnimation = el.animate(
        next
          ? [
              {
                // filter: "blur(5px)",
                transform: "scale(0.96)",
              },
              {
                // filter: "blur(0px)",
                transform: "scale(1)",
              },
            ]
          : [
              {
                // filter: "blur(5px)",
                transform: "scale(1.04)",
              },
              {
                // filter: "blur(0px)",
                transform: "scale(1)",
              },
            ],
        {
          duration: 300,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );

      currentAnimation.onfinish = () => {
        currentAnimation?.cancel();
        currentAnimation = null;
      };
    });

    return () => {
      currentAnimation?.cancel();
      unregisterFullscreenAnimator(modalKey);
    };
  }, [modalKey]);

  return (
    <Portal disabled={!portalled} container={portalRef}>
      <DialogPositioner zIndex={zIndex} p={isFullscreen ? 0 : 4}>
        {backdrop && <DialogBackdrop />}

        <ChakraDialog.Content
          ref={contentRef}
          overflow={"clip"}
          bg={"bg.body"}
          rounded={isFullscreen ? 0 : theme.radii.container}
          border={"1px solid"}
          borderColor={"border.subtle"}
          shadow={"md"}
          onAnimationStart={() => {
            if (!contentRef.current) return;
            updateDialogOffset(modalKey);
            const { x, y } = getDialogOffset(modalKey);
            contentRef.current.style.setProperty(DIALOG_OFFSET_X_VAR, `${x}px`);
            contentRef.current.style.setProperty(DIALOG_OFFSET_Y_VAR, `${y}px`);
          }}
          _open={{
            animation: clickOriginAnimation
              ? "scale-up-overshoot-from-click-origin"
              : "scale-up-overshoot",
            animationDuration: "slower",
          }}
          _closed={{
            animation: clickOriginAnimation
              ? "scale-down-to-click-origin"
              : "scale-down",
            animationDuration: "slow",
          }}
          {...restProps}
        />
      </DialogPositioner>
    </Portal>
  );
};

const DialogCloseTrigger = (props: ChakraDialog.CloseTriggerProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { close } = useDialogContext();

  return (
    <ChakraDialog.CloseTrigger
      asChild
      pos={"absolute"}
      top={3}
      right={3}
      {...restProps}
      onClick={(event) => {
        if (close) {
          close();
        } else {
          back();
        }
        onClick?.(event);
      }}
    />
  );
};

const DialogCloseButton = (props: DialogCloseButtonProps) => {
  // Props
  const { closeTriggerProps, ...restProps } = props;

  return (
    <DialogCloseTrigger {...closeTriggerProps}>
      <IconButton
        size={"2xs"}
        variant={"subtle"}
        bg={"an1"}
        rounded={"full"}
        {...restProps}
      >
        <AppTablerIcon icon={IconX} boxSize={4} />
      </IconButton>
    </DialogCloseTrigger>
  );
};

const DialogFullscreenButton = (props: IconButtonProps) => {
  // Contexts
  const { modalKey, fullscreen, setFullscreen } = useDialogContext();

  return (
    <IconButton
      size={"2xs"}
      variant={"subtle"}
      bg={"an1"}
      rounded={"full"}
      onClick={() => {
        const next = !fullscreen;
        triggerFullscreenAnimation(modalKey, next);
        setFullscreen(next);
      }}
      {...props}
    >
      <AppTablerIcon
        icon={fullscreen ? IconSquares : IconSquare}
        transform={"scaleX(-1)"}
        boxSize={3.5}
      />
    </IconButton>
  );
};

const DialogHeader = (props: ChakraDialog.TitleProps) => {
  return <ChakraDialog.Header pos={"relative"} p={4} {...props} />;
};

const DialogBody = (props: ChakraDialog.BodyProps) => {
  return <ChakraDialog.Body p={4} {...props} />;
};

const DialogFooter = (props: ChakraDialog.FooterProps) => {
  return (
    <ChakraDialog.Footer
      justifyContent={"stretch"}
      p={4}
      borderTop={"1px solid"}
      borderColor={"border.subtle"}
      {...props}
    />
  );
};

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  CloseTrigger: DialogCloseTrigger,
  CloseButton: DialogCloseButton,
  FullscreenButton: DialogFullscreenButton,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
};
