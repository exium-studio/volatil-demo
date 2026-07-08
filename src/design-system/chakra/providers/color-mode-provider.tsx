// src/design-system/chakra/providers/color-mode-provider.tsx

"use client";

import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ColorModeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute={"class"} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
