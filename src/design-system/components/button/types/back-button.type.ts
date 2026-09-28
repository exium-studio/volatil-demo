// src/design-system/components/button/types/back-button.type.ts

import type {
  ButtonProps,
  IconButtonProps,
} from "@/design-system/components/button/types/button.type";
import type { ComponentType, ReactNode } from "react";

export type BackButtonProps = (ButtonProps | IconButtonProps) & {
  isIconButton?: boolean;
  icon?: ComponentType;
  children?: ReactNode;
  preventNativeBack?: boolean;
};
