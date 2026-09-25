// src\design-system\components\navigation\types\link.type.ts

import type { AppIconSize } from "@/design-system/components/icon/types/app-icon.type";
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import type { LinkProps as TanstackLinkProps } from "@tanstack/react-router";

export type NavLinkProps = TanstackLinkProps & {};

export type ExternalLinkVariant = "underline" | "plain";

export type ExternalLinkProps = Omit<ChakraLinkProps, "variant" | "href"> & {
  href?: string | null;
  variant?: ExternalLinkVariant;
  iconSize?: AppIconSize;
};
