// src/design-system/components/navigation/types/link.type.ts

import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";

export type LinkProps = {
  to: string;
} & ChakraLinkProps;
