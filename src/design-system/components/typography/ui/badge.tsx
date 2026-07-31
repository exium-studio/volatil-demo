// src/design-system/components/typography/ui/badge.tsx

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = (props: BadgeProps) => {
  return <ChakraBadge fontSize={"sm"} {...props} />;
};
