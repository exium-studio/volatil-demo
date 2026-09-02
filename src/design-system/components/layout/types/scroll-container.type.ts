// src/design-system/components/layout/types/scroll-container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type VScrollContainerProps = StackProps & {
  showTopBorderOnScroll?: boolean;
  showBottomBorderOnScroll?: boolean;
  showScrollButtons?: boolean;
  enableScroll?: boolean;
};

export type HScrollContainerProps = StackProps & {
  showLeftBorderOnScroll?: boolean;
  showRightBorderOnScroll?: boolean;
  showScrollButtons?: boolean;
  enableScroll?: boolean;
};
