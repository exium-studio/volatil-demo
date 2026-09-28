import type { ImageProps as ChakraImageProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type ImageProps = Omit<ChakraImageProps, "aspectRatio"> & {
  fallback?: ReactNode;
  aspectRatio?: number;
  withSkeleton?: boolean;
};
