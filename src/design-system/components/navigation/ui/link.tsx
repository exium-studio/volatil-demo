// src/design-system/components/navigation/ui/link.tsx

"use client";

import type { LinkProps } from "@/design-system/components/navigation/types/link.type";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as TanstakLink } from "@tanstack/react-router";

export const Link = (props: LinkProps) => {
  // Props
  const { children, to, ...restProps } = props;

  return (
    <ChakraLink asChild {...restProps}>
      <TanstakLink to={to}>{children}</TanstakLink>
    </ChakraLink>
  );
};
