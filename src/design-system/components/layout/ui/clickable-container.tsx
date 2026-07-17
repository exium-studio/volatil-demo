// src/design-system/components/layout/ui/clickable-container.tsx

import type { ClickableContainerProps } from "@/design-system/components/layout/types/clickable-container.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { chakra } from "@chakra-ui/react";
import type { MouseEvent } from "react";

export const ClickableContainer = (props: ClickableContainerProps) => {
  const { children, targetRef, asLabel = true } = props;

  if (asLabel) {
    return (
      <chakra.label display={"flex"} alignItems={"center"} cursor={"pointer"}>
        {children}
      </chakra.label>
    );
  }

  return (
    <HStack
      cursor={"pointer"}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (targetRef?.current?.contains(e.target as Node)) return;
        targetRef?.current?.click();
      }}
    >
      {children}
    </HStack>
  );
};
