// src/design-system/components/media/types/image.type.ts

import type { ImageProps as ChakraImageProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type ImageProps = Omit<ChakraImageProps, "aspectRatio"> & {
  fallback?: ReactNode;
  aspectRatio?: number;
};
