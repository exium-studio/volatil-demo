// src/design-system/components/input/ui/segmented-control.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SegmentedControlProps } from "@/design-system/components/input/types/segmented-control.type";
import { SegmentGroup } from "@/design-system/components/input/ui/segment-group";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import * as React from "react";

export const SegmentedControl = React.forwardRef<
  HTMLInputElement,
  SegmentedControlProps
>(function SegmentedControl(props, ref) {
  // Props
  const { options, itemProps, colorPalette, ...restProps } = props;
  const indicatorBg = colorPalette ? `${colorPalette}.solid` : undefined;
  const activeIndicatorColor = colorPalette ? `${colorPalette}.contrast` : "fg";

  return (
    <SegmentGroup.Root ref={ref} {...restProps}>
      <SegmentGroup.Indicator bg={indicatorBg} />

      {options.map((option) => (
        <SegmentGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          _checked={{ color: activeIndicatorColor }}
          {...itemProps}
        >
          <SegmentGroup.ItemHiddenInput />

          {option.leftIcon && (
            <AppIcon icon={option.leftIcon} w={"20px"} h={"20px"} />
          )}

          {option.label && (
            <SegmentGroup.ItemText>
              <ClampedP>{option.label}</ClampedP>
            </SegmentGroup.ItemText>
          )}

          {option.rightIcon && (
            <AppIcon icon={option.rightIcon} w={"20px"} h={"20px"} />
          )}
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
});
