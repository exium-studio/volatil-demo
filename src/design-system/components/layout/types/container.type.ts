// src/design-system/components/layout/types/container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/stack.type";

export type ContainerRootProps = {
  withContext?: boolean;
} & StackProps;

export type ContainerHeaderProps = StackProps;

export type ContainerBodyProps = StackProps;
