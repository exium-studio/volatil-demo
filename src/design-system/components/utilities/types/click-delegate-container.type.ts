import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { RefObject } from "react";

export type ClickDelegateContainerProps = StackProps & {
  targetRef?: RefObject<HTMLElement | null>;
  onDelegateClick?: () => void;
};
