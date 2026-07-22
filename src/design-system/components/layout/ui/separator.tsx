// src/design-system/components/layout/ui/separator.tsx

import { Separator as ChakraSeparator } from "@chakra-ui/react";
import type { SeparatorProps as ChakraSeparatorProps } from "@chakra-ui/react";

export const Separator = (props: ChakraSeparatorProps) => {
  return <ChakraSeparator borderColor={"border"} {...props} />;
};
