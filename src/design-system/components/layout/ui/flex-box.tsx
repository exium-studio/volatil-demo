// src/design-system/components/layout/ui/flex-box.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import {
  HStack as ChakraHStack,
  Spacer as ChakraSpacer,
  VStack as ChakraVStack,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export const VStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <ChakraVStack ref={ref} align={"stretch"} gap={0} {...props} />;
});

export const HStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <ChakraHStack ref={ref} align={"stretch"} gap={0} {...props} />;
});

export const Spacer = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <ChakraSpacer ref={ref} {...props} />;
});
