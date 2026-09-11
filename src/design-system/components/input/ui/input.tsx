// src/design-system/components/input/ui/input.tsx

"use client";

import type { InputProps } from "@/design-system/components/input/types/input.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Input as ChakraInput } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraInput
      ref={ref}
      // variant={"subtle"}
      colorPalette={"neutral"}
      fontSize={"md"}
      rounded={theme.radii.component}
      {...props}
    />
  );
});
