// src/design-system/chakra/providers/color-mode-provider.tsx

"use client";

import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ColorModeProvider(props: ThemeProviderProps) {
  const { children, ...restProps } = props;
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme={"light"}
      disableTransitionOnChange
      {...restProps}
    >
      {children}
    </ThemeProvider>
  );
}
