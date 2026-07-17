// src/design-system/components/input/types/select.type.ts

import type { SelectRootProps } from "@chakra-ui/react";
import type { ComponentType, ReactNode, RefObject } from "react";

export type SelectOption = {
  icon?: ComponentType;
  label: string;
  value: unknown;
};

export type SelectProps = Omit<
  SelectRootProps,
  "value" | "onValueChange" | "collection"
> & {
  value?: string;
  onValueChange?: (value: string) => void;
  selectOptions?: SelectOption[];
  placeholder?: string;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  suffixLabel?: ReactNode;
};
