// src/design-system/components/input/ui/toggle-tip.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  InfoTipProps,
  ToggleTipProps,
} from "@/design-system/components/input/types/toggle-tip";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { InfoIcon } from "lucide-react";
import * as React from "react";

export const ToggleTip = React.forwardRef<HTMLDivElement, ToggleTipProps>(
  function ToggleTip(props, ref) {
    const {
      showArrow,
      children,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;

    return (
      <Popover.Root {...rest} positioning={{ ...rest.positioning, gutter: 4 }}>
        <Popover.Trigger asChild>{children}</Popover.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <Popover.Positioner>
            <Popover.Content
              width="auto"
              px="2"
              py="1"
              textStyle="xs"
              rounded="sm"
              ref={ref}
              {...contentProps}
            >
              {showArrow && (
                <Popover.Arrow>
                  <Popover.ArrowTip />
                </Popover.Arrow>
              )}
              {content}
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    );
  },
);

export const InfoTip = React.forwardRef<HTMLDivElement, InfoTipProps>(
  function InfoTip(props, ref) {
    const { children, buttonProps, ...restProps } = props;
    return (
      <ToggleTip ref={ref} content={children} {...restProps}>
        <IconButton
          variant={"ghost"}
          aria-label={"info"}
          size={"2xs"}
          {...buttonProps}
        >
          <AppIcon icon={InfoIcon} />
        </IconButton>
      </ToggleTip>
    );
  },
);
