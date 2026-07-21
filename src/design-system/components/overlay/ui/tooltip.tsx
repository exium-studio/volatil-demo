// src/design-system/components/overlay/ui/tooltip.tsx

import type { TooltipProps } from "@/design-system/components/overlay/types/tooltip.type";
import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
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
      ...restProps
    } = props;

    if (disabled) return children;

    return (
      <ChakraTooltip.Root {...restProps}>
        <ChakraTooltip.Trigger asChild w={w ?? width}>
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
