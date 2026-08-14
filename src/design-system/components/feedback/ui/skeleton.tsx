// src/design-system/components/feedback/ui/skeleton.tsx

"use client";

import type {
  SkeletonCircleProps,
  SkeletonProps,
  SkeletonTextProps,
} from "@/design-system/components/feedback/types/skeleton.type";
import { Center } from "@/design-system/components/layout/ui/center";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  Skeleton as ChakraSkeleton,
  SkeletonCircle as ChakraSkeletonCircle,
  SkeletonText as ChakraSkeletonText,
} from "@chakra-ui/react";

export const Skeleton = (props: SkeletonProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <Center
      w={"full"}
      h={"full"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      overflow={"clip"}
      {...props}
    >
      <ChakraSkeleton
        variant={"shine"}
        w={"full"}
        h={"full"}
        rounded={theme.radii.container}
        css={{
          "--start-color": "transparent",
          "--end-color": "colors.bg.subtle",
        }}
      />
    </Center>
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
