// src/design-system/components/layout/types/masked-container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type VMaskedContainerProps = StackProps & {
  maskingTop?: string | number;
  maskingBottom?: string | number;
};

export type HMaskedContainerProps = StackProps & {
  maskingLeft?: string | number;
  maskingRight?: string | number;
};
