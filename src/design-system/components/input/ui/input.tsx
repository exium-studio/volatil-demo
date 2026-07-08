// src/design-system/components/input/ui/input.tsx

"use client";

import type { InputProps } from "@/design-system/components/input/types/input.type";
import { MAIN_INPUT_SIZE } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Input as ChakraInput } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraInput
      ref={ref}
      size={MAIN_INPUT_SIZE}
      rounded={theme.radii.component}
      fontSize={"md"}
      {...props}
    />
  );
});
