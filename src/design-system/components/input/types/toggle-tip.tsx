// src/design-system/components/input/types/toggle-tip.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import type {
  PopoverContentProps,
  PopoverRootProps,
} from "@/design-system/components/overlay/types/popover.type";

export type ToggleTipProps = PopoverRootProps & {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  content?: React.ReactNode;
  contentProps?: PopoverContentProps;
};

export type InfoTipProps = Partial<ToggleTipProps> & {
  buttonProps?: IconButtonProps | undefined;
};
