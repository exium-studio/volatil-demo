// src/design-system/components/layout/ui/float.tsx

import { Float as ChakraFloat } from "@chakra-ui/react";
import type { FloatProps } from "@/design-system/components/layout/types/float.type";
import { forwardRef } from "react";

export const Float = forwardRef<HTMLDivElement, FloatProps>((props, ref) => {
  return <ChakraFloat ref={ref} {...props} />;
});
