// src/design-system/components/media/types/avatar.type.ts

import type { Avatar as ChakraAvatar } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type AvatarRootProps = ChakraAvatar.RootProps & {};

export type AvatarImageProps = ChakraAvatar.ImageProps & {};

export type AvatarFallbackProps = ChakraAvatar.FallbackProps & {};

export type AvatarProps = Omit<AvatarRootProps, "children"> & {
  name?: string;
  src?: string;
  srcSet?: string;
  loading?: "eager" | "lazy";
  icon?: ReactNode;
  fallback?: ReactNode;
  children?: ReactNode;
};
