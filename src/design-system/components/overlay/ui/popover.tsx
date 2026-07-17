// src/design-system/components/overlay/ui/popover.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { CloseButton } from "@/design-system/components/button/ui/close-button";
import type {
  PopoverArrowProps,
  PopoverArrowTipProps,
  PopoverBodyProps,
  PopoverCloseTriggerProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverFooterProps,
  PopoverHeaderProps,
  PopoverPositionerProps,
  PopoverRootProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "@/design-system/components/overlay/types/popover.type";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Popover as ChakraPopover } from "@chakra-ui/react";
import { forwardRef } from "react";

const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...restProps } = props;

  return (
    <ChakraPopover.Root autoFocus={false} {...restProps}>
      {children}
    </ChakraPopover.Root>
  );
};

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Trigger ref={ref} as={"span"} {...restProps}>
        {children}
      </ChakraPopover.Trigger>
    );
  },
);

const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ChakraPopover.Positioner ref={ref} {...restProps}>
        {children}
      </ChakraPopover.Positioner>
    );
  },
);

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (props, ref) => {
    // Props
    const { portalled = true, portalRef, ...restProps } = props;

    // Stores
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
            rounded={theme.radii.container}
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

const PopoverArrowTip = forwardRef<HTMLDivElement, PopoverArrowTipProps>(
  (props, ref) => {
    return <ChakraPopover.ArrowTip ref={ref} bg={"bg.body"} {...props} />;
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
      pos={"absolute"}
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

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Positioner: PopoverPositioner,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  ArrowTip: PopoverArrowTip,
  CloseTrigger: PopoverCloseTrigger,
  CLoseButton: PopoverCloseButton,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
  Title: PopoverTitle,
  Description: PopoverDescription,
};
