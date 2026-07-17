// src/design-system/components/overlay/ui/drawer.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { CloseButton } from "@/design-system/components/button/ui/close-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import type {
  DrawerCloseButtonProps,
  DrawerContentProps,
  DrawerRootProps,
} from "@/design-system/components/overlay/types/drawer.type";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { MODAL_BASE_ZINDEX } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { back } from "@/shared/utils/client/navigation";
import { Drawer as ChakraDrawer } from "@chakra-ui/react";
import { IconSquare, IconSquares } from "@tabler/icons-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type TouchEvent,
} from "react";

type GestureMode = "drag" | "scroll" | null;

type DrawerContextValue = {
  modalKey: string;
  opened: boolean;
  open?: () => void;
  close?: () => void;
  fullscreen: boolean;
  setFullscreen: Dispatch<SetStateAction<boolean>>;
  swipeToDismiss: boolean;
  placement: ChakraDrawer.RootProps["placement"];
  size: ChakraDrawer.RootProps["size"];
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error("useDrawerContext must be used within DrawerRoot");
  }

  return ctx;
}

function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let current: HTMLElement | null = el;

  while (current) {
    const style = window.getComputedStyle(current);

    const canScroll =
      /(auto|scroll)/.test(style.overflowY) &&
      current.scrollHeight > current.clientHeight;

    if (canScroll) return current;

    current = current.parentElement;
  }

  return null;
}

// ---------------------------------------------------------------------------

const DrawerRoot = (props: DrawerRootProps) => {
  // Props
  const {
    modalKey = "drawer",
    opened = false,
    open,
    close,
    swipeToDismiss = true,
    placement = "bottom",
    size = "sm",
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

  // Resolved Values
  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      modalKey,
      opened,
      open,
      close,
      fullscreen,
      setFullscreen,
      swipeToDismiss,
      placement,
      size,
    }),

    [
      modalKey,
      opened,
      open,
      close,
      fullscreen,
      setFullscreen,
      swipeToDismiss,
      placement,
      size,
    ],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <ChakraDrawer.Root
        open={delayedOpened}
        placement={placement}
        size={size}
        lazyMount
        unmountOnExit
        {...restProps}
        trapFocus={false}
        preventScroll
        onEscapeKeyDown={() => {
          if (close) {
            close();
          } else {
            back();
          }
        }}
      />
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = (props: ChakraDrawer.TriggerProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { open } = useDrawerContext();

  return (
    <ChakraDrawer.Trigger
      asChild
      onClick={(event) => {
        open?.();
        onClick?.(event);
      }}
      {...restProps}
    />
  );
};

const DrawerPositioner = (props: ChakraDrawer.PositionerProps) => {
  return <ChakraDrawer.Positioner {...props} />;
};

const DrawerBackdrop = (props: ChakraDrawer.BackdropProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { close } = useDrawerContext();

  return (
    <ChakraDrawer.Backdrop
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

const DrawerContent = (props: DrawerContentProps) => {
  // Props
  const {
    children,
    portalled = true,
    portalRef,
    backdrop = true,
    ...restProps
  } = props;

  // Contexts
  const { modalKey, opened, fullscreen, swipeToDismiss, placement, size } =
    useDrawerContext();
  const { theme } = useThemeStore();

  // Refs
  const startYRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const offsetYRef = useRef<number>(0);

  const modeRef = useRef<GestureMode>(null);
  const scrollElRef = useRef<HTMLElement | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  // Constants
  const rounded = {
    start: {
      roundedRight: theme.radii.container,
    },
    end: {
      roundedLeft: theme.radii.container,
    },
    top: {
      roundedBottom: theme.radii.container,
    },
    bottom: {
      roundedTop: theme.radii.container,
    },
  };

  // Derived Values
  const zIndex = MODAL_BASE_ZINDEX + modalKey.split(".").length;

  // Handlers
  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    event.stopPropagation();

    startYRef.current = event.touches[0].clientY;
    startTimeRef.current = performance.now();

    modeRef.current = null;
    scrollElRef.current = getScrollableAncestor(target);
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (!contentRef.current) return;
    if (!swipeToDismiss) return;

    event.stopPropagation();

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (modeRef.current === null) {
      const scrollEl = scrollElRef.current;

      const canScroll =
        scrollEl !== null && scrollEl.scrollTop > 0 && deltaY > 0;

      if (canScroll) {
        modeRef.current = "scroll";
        return;
      }

      modeRef.current = "drag";
    }

    if (modeRef.current === "scroll") return;

    const offset = Math.max(0, deltaY);
    offsetYRef.current = offset;

    contentRef.current.style.transition = "none";
    contentRef.current.style.transform = `translateY(${offset}px)`;
  }

  function handleTouchEnd() {
    if (!contentRef.current) return;
    if (!swipeToDismiss) return;

    const elapsed = performance.now() - startTimeRef.current;
    const velocity = elapsed > 0 ? offsetYRef.current / elapsed : 0;
    const height = contentRef.current.offsetHeight;

    const shouldClose = offsetYRef.current > height * 0.3 || velocity > 0.8;

    contentRef.current.style.transition = "transform 200ms ease";

    if (shouldClose) {
      contentRef.current.style.transform = `translateY(${height}px)`;

      window.setTimeout(() => {
        back();
      }, 200);
    } else {
      contentRef.current.style.transform = "translateY(0)";
    }

    offsetYRef.current = 0;
    modeRef.current = null;
    scrollElRef.current = null;
  }

  useEffect(() => {
    if (opened && contentRef.current) {
      contentRef.current.style.transform = "";
      contentRef.current.style.transition = "";
    }
  }, [opened]);

  return (
    <Portal disabled={!portalled} container={portalRef}>
      <DrawerPositioner zIndex={zIndex}>
        {backdrop && <DrawerBackdrop />}

        <ChakraDrawer.Content
          ref={contentRef}
          overflow={"clip"}
          pos={"relative"}
          bg={"bg.body"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          shadow={"md"}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-placement={placement}
          {...(fullscreen || size === "full"
            ? { rounded: 0 }
            : rounded[placement as keyof typeof rounded])}
          _open={{
            animationDuration: "slowest",
          }}
          _closed={{
            animationDuration: "slowest",
          }}
          {...restProps}
        >
          {swipeToDismiss && (
            <Box
              w={"80px"}
              h={"4px"}
              rounded={"full"}
              bg={"bg.muted"}
              my={1.5}
              mx={"auto"}
            />
          )}

          {children}
        </ChakraDrawer.Content>
      </DrawerPositioner>
    </Portal>
  );
};

const DrawerCloseTrigger = (props: ChakraDrawer.CloseTriggerProps) => {
  // Props
  const { onClick, ...restProps } = props;

  // Contexts
  const { close } = useDrawerContext();

  return (
    <ChakraDrawer.CloseTrigger
      asChild
      pos={"absolute"}
      top={3.5}
      right={3.5}
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

const DrawerCloseButton = (props: DrawerCloseButtonProps) => {
  // Props
  const { closeTriggerProps, ...restProps } = props;

  return (
    <DrawerCloseTrigger {...closeTriggerProps}>
      <CloseButton
        size={"2xs"}
        variant={"subtle"}
        bg={"an1"}
        rounded={"full"}
        {...restProps}
      />
    </DrawerCloseTrigger>
  );
};

const DrawerFullscreenButton = (props: IconButtonProps) => {
  // Contexts
  const { fullscreen, setFullscreen } = useDrawerContext();

  return (
    <IconButton
      size={"2xs"}
      variant={"subtle"}
      bg={"an1"}
      rounded={"full"}
      onClick={() => {
        const next = !fullscreen;
        setFullscreen(next);
      }}
      {...props}
    >
      <AppIcon
        icon={fullscreen ? IconSquares : IconSquare}
        transform={"scaleX(-1)"}
        boxSize={3.5}
      />
    </IconButton>
  );
};

const DrawerHeader = (props: ChakraDrawer.HeaderProps) => {
  return <ChakraDrawer.Header pos={"relative"} p={4} {...props} />;
};

const DrawerBody = (props: ChakraDrawer.BodyProps) => {
  return (
    <ChakraDrawer.Body display={"flex"} flexDir={"column"} p={4} {...props} />
  );
};

const DrawerFooter = (props: ChakraDrawer.FooterProps) => {
  return <ChakraDrawer.Footer justifyContent={"stretch"} p={4} {...props} />;
};

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Backdrop: DrawerBackdrop,
  Positioner: DrawerPositioner,
  Content: DrawerContent,
  CloseTrigger: DrawerCloseTrigger,
  CloseButton: DrawerCloseButton,
  FullscreenButton: DrawerFullscreenButton,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
};
