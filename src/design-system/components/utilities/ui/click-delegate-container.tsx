// src/design-system/components/utilities/ui/click-delegate-container.tsx

import type { ClickDelegateContainerProps } from "@/design-system/components/utilities/types/click-delegate-container.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { forwardRef, useImperativeHandle, useRef } from "react";

/**
 * Container component that delegates click events to a target ref element
 * (e.g. input, checkbox, switch) or triggers an onDelegateClick callback
 * when clicked anywhere on its bounding container.
 */
export const ClickDelegateContainer = forwardRef<
  HTMLDivElement,
  ClickDelegateContainerProps
>((props, ref) => {
  // Props
  const { targetRef, onDelegateClick, onClick, children, ...restProps } = props;

  // Refs
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  // Handlers
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    if (onDelegateClick) {
      onDelegateClick();
      return;
    }

    if (
      targetRef?.current &&
      e.target !== targetRef.current &&
      !targetRef.current.contains(e.target as Node)
    ) {
      targetRef.current.click();
    }
  };

  return (
    <HStack
      ref={innerRef}
      cursor={"pointer"}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </HStack>
  );
});
