// src/design-system/components/typography/ui/count-badge.tsx

import { Float } from "@/design-system/components/layout/ui/float";
import type { CountBadgeProps } from "@/design-system/components/typography/types/count-badge.type";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { useMemo } from "react";

export const CountBadge = (props: CountBadgeProps) => {
  // Props
  const {
    count,
    max = 99,
    isFloating = false,
    floatProps,
    colorPalette = "blue",
    size = "xs",
    ...restProps
  } = props;

  // Derived Values
  const formattedCount = useMemo(() => {
    if (count > max) {
      return `${max}+`;
    }
    return String(count);
  }, [count, max]);

  const badgeContent = (
    <Badge
      colorPalette={colorPalette}
      size={size}
      rounded={"full"}
      px={1.5}
      py={0.5}
      fontSize={"2xs"}
      fontWeight={"bold"}
      {...restProps}
    >
      {formattedCount}
    </Badge>
  );

  if (isFloating) {
    return (
      <Float placement={"top-end"} {...floatProps}>
        {badgeContent}
      </Float>
    );
  }

  return badgeContent;
};
