// src/design-system/components/button/types/button.type.ts

import type {
  ButtonProps as ChakraButtonProps,
  IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";

export type ButtonProps = ChakraButtonProps & {
  primary?: boolean;
};

export type IconButtonProps = ChakraIconButtonProps &
  ButtonProps & {
    primary?: boolean;
  };
