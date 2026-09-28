// src/design-system/components/layout/types/clickable-container.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type ClickableContainerProps = StackProps & {
  children: React.ReactNode;
  targetRef?: React.RefObject<HTMLInputElement>;
  asLabel?: boolean;
};
