// src/design-system/components/navigation/types/link.type.ts

import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import type { LinkProps as TanstackLinkProps } from "@tanstack/react-router";

export type NavLinkProps = TanstackLinkProps & {};

export type ExternalLinkProps = ChakraLinkProps & {};
