// src/design-system/components/branding/types/logo.type.ts

import type { CenterProps } from "@chakra-ui/react";

export type LogoProps = CenterProps & {
  color?: string;
  boxSize?: number | `${number}px`;
};
