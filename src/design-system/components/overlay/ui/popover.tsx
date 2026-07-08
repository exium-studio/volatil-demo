// src/design-system/components/overlay/ui/popover.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { CloseButton } from "@/design-system/components/button/ui/close-button";
import type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverCloseTriggerProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverFooterProps,
  PopoverHeaderProps,
  PopoverRootProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "@/design-system/components/overlay/types/popover.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Popover as ChakraPopover, Portal } from "@chakra-ui/react";
import { forwardRef } from "react";

const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...restProps } = props;

  return (
    <ChakraPopover.Root autoFocus={false} {...restProps}>
      {children}
    </ChakraPopover.Root>
  );
};

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (props, ref) => {
    const { portalled = true, portalRef, ...restProps } = props;
    const { theme } = useThemeStore();

    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content
            ref={ref}
            p={0}
            bg={"bg.body"}
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={`calc(${theme.radii.component} - 4px)`}
            shadow={"soft"}
            {...restProps}
          />
        </ChakraPopover.Positioner>
      </Portal>
    );
  },
);

const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(
  (props, ref) => {
    return (
      <ChakraPopover.Arrow ref={ref}>
        <ChakraPopover.ArrowTip bg={"bg.body"} {...props} />
      </ChakraPopover.Arrow>
    );
  },
);

const PopoverCloseTrigger = forwardRef<
  HTMLButtonElement,
  PopoverCloseTriggerProps
>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <ChakraPopover.CloseTrigger
      ref={ref}
      asChild
      position={"absolute"}
      top={"1"}
      insetEnd={"1"}
      {...restProps}
    >
      {children}
    </ChakraPopover.CloseTrigger>
  );
});

const PopoverCloseButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    return (
      <PopoverCloseTrigger>
        <CloseButton ref={ref} size={"sm"} {...props} />
      </PopoverCloseTrigger>
    );
  },
);

const PopoverTitle = forwardRef<HTMLDivElement, PopoverTitleProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Title ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Title>
    );
  },
);

const PopoverDescription = forwardRef<HTMLDivElement, PopoverDescriptionProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Description ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Description>
    );
  },
);

const PopoverFooter = forwardRef<HTMLDivElement, PopoverFooterProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Footer ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Footer>
    );
  },
);

const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Header ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Header>
    );
  },
);

const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Body ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Body>
    );
  },
);

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Trigger ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Trigger>
    );
  },
);

export const Popover = {
  Root: PopoverRoot,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  CloseTrigger: PopoverCloseTrigger,
  CLoseButton: PopoverCloseButton,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Footer: PopoverFooter,
  Header: PopoverHeader,
  Body: PopoverBody,
  Trigger: PopoverTrigger,
};
