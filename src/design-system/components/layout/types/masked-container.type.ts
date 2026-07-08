// src/design-system/components/layout/types/masked-container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/stack.type";

export type VMaskedContainerProps = {
  maskingTop?: string | number;
  maskingBottom?: string | number;
} & StackProps;

export type HMaskedContainerProps = {
  maskingLeft?: string | number;
  maskingRight?: string | number;
} & StackProps;
