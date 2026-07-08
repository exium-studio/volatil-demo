// src/design-system/components/button/ui/button.tsx

"use client";

import { forwardRef } from "react";
import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from "@chakra-ui/react";
import { MAIN_BUTTON_SIZE } from "@/design-system/constants/styles";
import type {
  ButtonProps,
  IconButtonProps,
} from "@/design-system/components/button/types/button.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    // Props
    const { primary, variant, colorPalette, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraButton
        ref={ref}
        size={MAIN_BUTTON_SIZE}
        variant={primary ? "solid" : variant || "ghost"}
        colorPalette={primary ? theme.colorPalette : colorPalette || "neutral"}
        gap={2}
        rounded={theme.radii.component}
        fontSize={"md"}
        fontWeight={"normal"}
        userSelect={"none"}
        {...restProps}
      />
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
        size={MAIN_BUTTON_SIZE}
        variant={primary ? "solid" : variant || "ghost"}
        colorPalette={primary ? theme.colorPalette : colorPalette || "neutral"}
        rounded={theme.radii.component}
        fontWeight={"normal"}
        userSelect={"none"}
        {...restProps}
      />
    );
  },
);
