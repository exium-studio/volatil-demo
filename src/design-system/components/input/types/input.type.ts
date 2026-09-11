// src/design-system/components/input/types/input.type.ts

import type { InputProps as ChakraInputProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type InputProps = ChakraInputProps & {
  startElement?: ReactNode;
  endElement?: ReactNode;
};
