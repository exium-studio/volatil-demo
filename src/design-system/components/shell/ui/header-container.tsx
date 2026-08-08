// src/design-system/components/shell/ui/header-container.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HEADER_H, PADDING_MD } from "@/design-system/constants/styles";

export const HeaderContainer = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      minH={HEADER_H}
      maxH={HEADER_H}
      px={PADDING_MD}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
