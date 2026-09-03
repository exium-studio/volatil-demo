// src/design-system/components/overlay/ui/tooltip.tsx

import type { TooltipProps } from "@/design-system/components/overlay/types/tooltip.type";
import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import { forwardRef } from "react";

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

    if (disabled) return children;

    return (
      <ChakraTooltip.Root
        openDelay={openDelay}
        {...restProps}
      >
        <ChakraTooltip.Trigger
          asChild
          w={w ?? width}
        >
          {children}
        </ChakraTooltip.Trigger>

        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner zIndex={9999}>
            <ChakraTooltip.Content
              ref={ref}
              bg={"bg.contrast"}
              zIndex={9999}
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
