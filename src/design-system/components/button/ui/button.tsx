// src/design-system/components/button/ui/button.tsx

"use client";

import type {
  ButtonProps,
  IconButtonProps,
} from "@/design-system/components/button/types/button.type";
import { SIZES } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
  Span,
} from "@chakra-ui/react";
import { Children, forwardRef, useMemo } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    // Props
    const {
      primary,
      variant,
      colorPalette,
      lineClamp = 1,
      children,
      minW = 0,
      maxW = "full",
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Derived Values — Combine contiguous text nodes into a single clamped Span
    const formattedChildren = useMemo(() => {
      const childArray = Children.toArray(children);
      const result: React.ReactNode[] = [];
      let currentTextGroup: (string | number)[] = [];

      const flushTextGroup = () => {
        if (currentTextGroup.length > 0) {
          const combinedText = currentTextGroup.join("");
          const clampVal = lineClamp != null ? Number(lineClamp) : 1;

          result.push(
            <Span
              key={`button-text-group-${result.length}`}
              lineClamp={clampVal > 0 ? clampVal : undefined}
              truncate={clampVal === 1}
              minW={0}
              maxW={"full"}
              overflow={"hidden"}
              display={"inline-block"}
              lineHeight={"normal"}
              whiteSpace={clampVal === 1 ? "nowrap" : "normal"}
              textOverflow={clampVal === 1 ? "ellipsis" : undefined}
              py={"1px"}
            >
              {combinedText}
            </Span>,
          );
          currentTextGroup = [];
        }
      };

      childArray.forEach((child) => {
        if (typeof child === "string" || typeof child === "number") {
          currentTextGroup.push(child);
        } else {
          flushTextGroup();
          result.push(child);
        }
      });

      flushTextGroup();

      return result;
    }, [children, lineClamp]);

    return (
      <ChakraButton
        ref={ref}
        size={SIZES.mainButton}
        variant={variant || (primary ? "solid" : "ghost")}
        colorPalette={colorPalette ?? (primary ? theme.colorPalette : "neutral")}
        gap={2}
        rounded={theme.radii.component}
        fontSize={"md"}
        fontWeight={"normal"}
        userSelect={"none"}
        minW={minW}
        maxW={maxW}
        overflow={"hidden"}
        {...restProps}
      >
        {formattedChildren}
      </ChakraButton>
    );
  },
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function Iconbutton(props, ref) {
    // Props
    const { primary, variant, colorPalette, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraIconButton
        ref={ref}
        size={SIZES.mainButton}
        variant={variant || (primary ? "solid" : "ghost")}
        colorPalette={colorPalette ?? (primary ? theme.colorPalette : "neutral")}
        rounded={theme.radii.component}
        fontWeight={"normal"}
        userSelect={"none"}
        {...restProps}
      />
    );
  },
);
