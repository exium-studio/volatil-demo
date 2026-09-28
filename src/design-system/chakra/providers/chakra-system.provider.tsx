// src/design-system/chakra/providers/chakra-system.provider.tsx

"use client";

import { chakraSystem } from "@/design-system/chakra/chakra-system";
import { ChakraProvider } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

export function ChakraSystemProvider({ children }: PropsWithChildren) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}
