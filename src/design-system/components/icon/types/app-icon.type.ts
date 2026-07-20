// src/design-system/components/icon/types/app-icon.type.ts

import type { IconProps } from "@chakra-ui/react";
import type { ComponentType } from "react";

export type AppIconProps = IconProps & {
  icon?: ComponentType;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
};
