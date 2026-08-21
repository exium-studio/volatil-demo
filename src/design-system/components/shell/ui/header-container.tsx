// src/design-system/components/shell/ui/header-container.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { DIMENSIONS, SPACING } from "@/design-system/constants/styles";
export const HeaderContainer = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      minH={DIMENSIONS.headerH}
      maxH={DIMENSIONS.headerH}
      px={SPACING.md}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
