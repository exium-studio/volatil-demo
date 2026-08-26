// src/design-system/components/feedback/types/skeleton.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type {
  SkeletonCircleProps as ChakraSkeletonCircleProps,
  SkeletonProps as ChakraSkeletonProps,
  SkeletonTextProps as ChakraSkeletonTextProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SkeletonProps = BoxProps & {
  loading?: boolean;
  loaded?: boolean;
  children?: ReactNode;
  variant?: ChakraSkeletonProps["variant"];
};

export type SkeletonCircleProps = ChakraSkeletonCircleProps;

export type SkeletonTextProps = ChakraSkeletonTextProps;
