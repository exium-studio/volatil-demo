// src/design-system/components/navigation/ui/link.tsx

import type {
  ExternalLinkProps,
  NavLinkProps,
} from "@/design-system/components/navigation/types/link.type";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as TanstackLink } from "@tanstack/react-router";

export const NavLink = (props: NavLinkProps) => {
  return <TanstackLink {...props} />;
};

export const ExternalLink = (props: ExternalLinkProps) => {
  return <ChakraLink target={"_blank"} {...props} />;
};
