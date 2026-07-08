// src/design-system/components/button/types/button.type.ts

import type {
  ButtonProps as ChakraButtonProps,
  IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";

export type ButtonProps = {
  primary?: boolean;
} & ChakraButtonProps;

export type IconButtonProps = {
  primary?: boolean;
} & ButtonProps &
  ChakraIconButtonProps;
