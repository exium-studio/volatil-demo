// src/design-system/components/shell/ui/header-container.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";

export const HeaderContainer = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      minH={"headerH"}
      px={"md"}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
