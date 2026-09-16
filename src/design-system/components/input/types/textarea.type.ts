import type { TextareaProps as ChakraTextareaProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type TextareaProps = ChakraTextareaProps & {
  startElement?: ReactNode;
};
