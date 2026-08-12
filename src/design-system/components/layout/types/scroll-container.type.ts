// src/design-system/components/layout/types/scroll-container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type VScrollContainerProps = StackProps & {
  showTopBorderOnScroll?: boolean;
  showScrollButtons?: boolean;
  enableScroll?: boolean;
};

export type HScrollContainerProps = StackProps & {
  showScrollButtons?: boolean;
  enableScroll?: boolean;
};
