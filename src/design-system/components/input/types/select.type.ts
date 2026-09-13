// src/design-system/components/input/types/select.type.ts

import type { SelectRootProps } from "@chakra-ui/react";
import type { ComponentType, ReactNode, RefObject } from "react";

export type SelectOption = {
  startElement?: ReactNode | ComponentType;
  icon?: ComponentType;
  label: string;
  value: unknown;
  description?: string;
  [key: string]: unknown;
};

export type SelectTriggerRenderParams = {
  selectedOption?: SelectOption;
  value?: string;
  placeholder: string;
  disabled?: boolean;
};

export type SelectProps = Omit<
  SelectRootProps,
  "value" | "onValueChange" | "collection"
> & {
  value?: string;
  onValueChange?: (value: string, option?: SelectOption) => void;
  options?: SelectOption[];
  /** @deprecated use `options` instead */
  selectOptions?: SelectOption[];
  placeholder?: string;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  suffixLabel?: ReactNode;
  trigger?: ReactNode | ((params: SelectTriggerRenderParams) => ReactNode);
  renderOption?: (option: SelectOption) => ReactNode;
};

