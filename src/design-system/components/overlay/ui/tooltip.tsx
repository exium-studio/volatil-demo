// src/design-system/components/overlay/ui/tooltip.tsx

import type { TooltipProps } from "@/design-system/components/overlay/types/tooltip.type";
import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import { forwardRef, useEffect, useRef, useState } from "react";

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    // Props
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      w,
      width,
      openDelay = 300,
      ...restProps
    } = props;

    // States
    const [open, setOpen] = useState(false);

    // Refs
    const blockedRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const clearOpenTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };

    useEffect(() => clearOpenTimer, []);

    const handlePointerEnter = () => {
      if (blockedRef.current) return;

      clearOpenTimer();
      timeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, openDelay);
    };

    const handlePointerLeave = () => {
      clearOpenTimer();
      blockedRef.current = false;
      setOpen(false);
    };

    const handlePointerDown = () => {
      clearOpenTimer();
      blockedRef.current = true;
      setOpen(false);
    };

    if (disabled) return children;

    return (
      <ChakraTooltip.Root
        {...restProps}
        open={open}
        onOpenChange={(e) => {
          if (!e.open) setOpen(false);
        }}
      >
        <ChakraTooltip.Trigger
          asChild
          w={w ?? width}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
        >
          {children}
        </ChakraTooltip.Trigger>

        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              ref={ref}
              bg={"bg.contrastX"}
              {...contentProps}
            >
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
