// src/design-system/components/layout/ui/aspect-ratio.tsx

import type { AspectRatioProps } from "@/design-system/components/layout/types/aspect-ratio.type";
import { AspectRatio as ChakraAspectRatio } from "@chakra-ui/react";

export const AspectRatio = (props: AspectRatioProps) => {
  return <ChakraAspectRatio {...props} />;
};
