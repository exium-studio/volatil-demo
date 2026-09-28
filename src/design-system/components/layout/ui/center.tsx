// src/design-system/components/layout/ui/center.tsx

import type {
  AbsoluteCenterProps,
  CenterProps,
} from "@/design-system/components/layout/types/center.type";
import {
  Center as ChakraCenter,
  AbsoluteCenter as ChakraAbsoluteCenter,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export const Center = forwardRef<HTMLDivElement, CenterProps>((props, ref) => {
  return <ChakraCenter ref={ref} {...props} />;
});

export const AbsoluteCenter = forwardRef<HTMLDivElement, AbsoluteCenterProps>(
  (props, ref) => {
    return <ChakraAbsoluteCenter ref={ref} {...props} />;
  },
);
