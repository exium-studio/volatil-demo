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
  // Props
  const { loading, loaded, children, variant = "shine", ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  const isLoaded =
    loaded !== undefined
      ? loaded
      : loading !== undefined
        ? !loading
        : undefined;

  // If used as a loaded container and content is loaded, render children
  if (isLoaded === true && children) {
    return <>{children}</>;
  }

  // If wrapping children while still loading, use ChakraSkeleton as wrapper
  if (children) {
    return (
      <Center
        w={"full"}
        h={"full"}
        bg={"bg.body"}
        rounded={theme.radii.container}
        overflow={"clip"}
        {...restProps}
      >
        <ChakraSkeleton
          loading={isLoaded !== undefined ? !isLoaded : true}
          variant={variant}
          w={"full"}
          h={"full"}
          rounded={theme.radii.container}
          css={{
            "--start-color": "transparent",
            "--end-color": "colors.bg.subtle",
          }}
        >
          {children}
        </ChakraSkeleton>
      </Center>
    );
  }

  return (
    <Center
      w={"full"}
      h={"full"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      overflow={"clip"}
      {...restProps}
    >
      <ChakraSkeleton
        variant={variant}
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
