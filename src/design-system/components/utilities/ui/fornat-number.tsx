// src/design-system/components/utilities/ui/fornat-number.tsx

import type { FornatNumberProps } from "@/design-system/components/utilities/types/format-number.type";
import { FormatNumber as ChakraFormatNumber } from "@chakra-ui/react";

export const FormatNumber = (props: FornatNumberProps) => {
  // Props
  const { ...restProps } = props;

  return <ChakraFormatNumber {...restProps} />;
};
