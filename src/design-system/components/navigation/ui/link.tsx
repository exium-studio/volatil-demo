// src/design-system/components/navigation/ui/link.tsx

import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import type { LinkProps as TanstackLinkProps } from "@tanstack/react-router";
import { Link as TanstackLink } from "@tanstack/react-router";

export const NavLink = (props: TanstackLinkProps) => {
  return <TanstackLink {...props} />;
};

export const ExternalLink = (props: ChakraLinkProps) => {
  return <ChakraLink target={"_blank"} {...props} />;
};
