// src/design-system/components/navigation/ui/link.tsx

"use client";

import { Link as ChakraLink } from "@chakra-ui/react";
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { Link as TanstakLink } from "@tanstack/react-router";

export type LinkProps = {
  to: string;
} & ChakraLinkProps;

export const Link = (props: LinkProps) => {
  // Props
  const { children, to, ...restProps } = props;

  return (
    <ChakraLink asChild {...restProps}>
      <TanstakLink to={to}>{children}</TanstakLink>
    </ChakraLink>
  );
};
