// src/design-system/components/typography/ui/badge.tsx

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = (props: BadgeProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraBadge
      fontSize={"sm"}
      rounded={`calc(${theme.radii.component} - 2px)`}
      {...props}
    />
  );
};
