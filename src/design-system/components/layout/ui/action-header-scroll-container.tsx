// src/design-system/components/layout/ui/action-header-scroll-container.tsx

import type { ActionHeaderScrollContainerProps } from "@/design-system/components/layout/types/action-header-scroll-container.type";
import { HScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { forwardRef } from "react";

export const ActionHeaderScrollContainer = forwardRef<
  HTMLDivElement,
  ActionHeaderScrollContainerProps
>(function ActionHeaderScrollContainer(props, ref) {
  // Props
  const {
    children,
    showScrollButtons = true,
    align = "center",
    justify = "start",
    gap = "sm",
    w = "full",
    p = "md",
    bg = "bg.body",
    ...restProps
  } = props;

  return (
    <HScrollContainer
      ref={ref}
      align={align}
      justify={justify}
      gap={gap}
      w={w}
      p={p}
      bg={bg}
      showScrollButtons={showScrollButtons}
      {...restProps}
    >
      {children}
    </HScrollContainer>
  );
});
