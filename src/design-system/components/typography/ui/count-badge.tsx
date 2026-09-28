// src/design-system/components/typography/ui/count-badge.tsx

import { Float } from "@/design-system/components/layout/ui/float";
import type { CountBadgeProps } from "@/design-system/components/typography/types/count-badge.type";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useMemo } from "react";

export const CountBadge = (props: CountBadgeProps) => {
  // Props
  const {
    count,
    max = 99,
    floating = false,
    floatProps,
    colorPalette,
    size = "xs",
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const formattedCount = useMemo(() => {
    if (count > max) {
      return `${max}+`;
    }
    return String(count);
  }, [count, max]);

  const badgeContent = (
    <Badge
      colorPalette={colorPalette ?? theme.colorPalette}
      size={size}
      rounded={"full"}
      px={1.5}
      py={0.5}
      fontSize={"2xs"}
      fontWeight={"semibold"}
      {...restProps}
    >
      {formattedCount}
    </Badge>
  );

  if (floating) {
    return (
      <Float placement={"top-end"} {...floatProps}>
        {badgeContent}
      </Float>
    );
  }

  return badgeContent;
};
