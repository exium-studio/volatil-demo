// src/design-system/components/icon/types/icon.type.ts

import type { IconProps as ChakraIconProps } from "@chakra-ui/react";
import type { LucideIcon, LucideProps } from "lucide-react";

export type IconProps = ChakraIconProps;

export type LucideIconProps = LucideProps & {
  icon?: LucideIcon;
};
