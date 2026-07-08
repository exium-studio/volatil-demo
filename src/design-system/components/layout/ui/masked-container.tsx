// src/design-system/components/layout/ui/masked-container.tsx

import type {
  HMaskedContainerProps,
  VMaskedContainerProps,
} from "@/design-system/components/layout/types/masked-container.type";
import { VStack } from "@/design-system/components/layout/ui/stack";
import { forwardRef } from "react";

export const VMaskedContainer = forwardRef<
  HTMLDivElement,
  VMaskedContainerProps
>((props, ref) => {
  const {
    maskingTop = "8px",
    maskingBottom = "8px",
    style,
    children,
    ...restProps
  } = props;

  const toPx = (v: string | number) => (typeof v === "number" ? `${v}px` : v);
  const top = toPx(maskingTop);
  const bottom = toPx(maskingBottom);

  const mask = `
    linear-gradient(
      to bottom,
      transparent 0,
      black ${top},
      black calc(100% - ${bottom}),
      transparent 100%
    )
  `;

  return (
    <VStack
      ref={ref}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        ...style,
      }}
      {...restProps}
    >
      {children}
    </VStack>
  );
});

export const HMaskedContainer = forwardRef<
  HTMLDivElement,
  HMaskedContainerProps
>((props, ref) => {
  const {
    maskingLeft = "8px",
    maskingRight = "8px",
    style,
    children,
    ...restProps
  } = props;

  const toPx = (v: string | number) => (typeof v === "number" ? `${v}px` : v);

  const left = toPx(maskingLeft);
  const right = toPx(maskingRight);

  const mask = `
    linear-gradient(
      to right,
      transparent 0,
      black ${left},
      black calc(100% - ${right}),
      transparent 100%
    )
  `;

  return (
    <VStack
      ref={ref}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        ...style,
      }}
      {...restProps}
    >
      {children}
    </VStack>
  );
});

VMaskedContainer.displayName = "VMaskedContainer";
HMaskedContainer.displayName = "HMaskedContainer";
