// src/design-system/components/input/ui/input-group.tsx

import type { InputGroupProps } from "@/design-system/components/input/types/input-group.type";
import { InputGroup as ChakraInputGroup } from "@chakra-ui/react";

export const InputGroup = (props: InputGroupProps) => {
  return <ChakraInputGroup {...props} />;
};
