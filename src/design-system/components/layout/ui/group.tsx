// src/design-system/components/layout/ui/group.tsx

import type { GroupProps } from "@/design-system/components/layout/types/group.type";
import { Group as ChakraGroup } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Group = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {
  return <ChakraGroup ref={ref} {...props} />;
});
