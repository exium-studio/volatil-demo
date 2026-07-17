// src/design-system/components/feedback/ui/skeleton.tsx

"use client";

import type {
  SkeletonCircleProps,
  SkeletonProps,
  SkeletonTextProps,
} from "@/design-system/components/feedback/types/skeleton.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  Skeleton as ChakraSkeleton,
  SkeletonCircle as ChakraSkeletonCircle,
  SkeletonText as ChakraSkeletonText,
} from "@chakra-ui/react";

export const Skeleton = (props: SkeletonProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraSkeleton
      rounded={theme.radii.component}
      variant={"shine"}
      css={{
        "--start-color": "transparent",
        "--end-color": "colors.bg.subtle",
      }}
      {...props}
    />
  );
};

export const SkeletonCircle = (props: SkeletonCircleProps) => {
  return (
    <ChakraSkeletonCircle
      variant={"shine"}
      css={{
        "--start-color": "transparent",
        "--end-color": "colors.bg.subtle",
      }}
      {...props}
    />
  );
};

export const SkeletonText = (props: SkeletonTextProps) => {
  return (
    <ChakraSkeletonText
      variant={"shine"}
      css={{
        "--start-color": "transparent",
        "--end-color": "colors.bg.subtle",
      }}
      {...props}
    />
  );
};
