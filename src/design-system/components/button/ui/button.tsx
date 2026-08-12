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
          result.push(
            <Span
              key={`button-text-group-${result.length}`}
              lineClamp={
                lineClamp && Number(lineClamp) > 0 ? lineClamp : undefined
              }
              truncate={lineClamp === 1}
              minW={0}
              maxW={"full"}
              overflow={"hidden"}
              display={"inline-block"}
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
        colorPalette={primary ? theme.colorPalette : colorPalette || "neutral"}
        gap={2}
        pb={"2px"}
        rounded={theme.radii.component}
        fontSize={"md"}
        fontWeight={"normal"}
        userSelect={"none"}
        minW={minW}
        maxW={maxW}
        _active={{
          transform: "scale(0.98)",
        }}
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
        colorPalette={primary ? theme.colorPalette : colorPalette || "neutral"}
        rounded={theme.radii.component}
        fontWeight={"normal"}
        userSelect={"none"}
        _active={{
          transform: "scale(0.98)",
        }}
        {...restProps}
      />
    );
  },
);
