// src/design-system/components/layout/ui/box.tsx

import type {
  BoxProps,
  CircleProps,
} from "@/design-system/components/layout/types/box.type";
import { Box as ChakraBox, Circle as ChakraCircle } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <ChakraBox ref={ref} {...props} />;
});

export const Circle = forwardRef<HTMLDivElement, CircleProps>((props, ref) => {
  return <ChakraCircle ref={ref} {...props} />;
});
