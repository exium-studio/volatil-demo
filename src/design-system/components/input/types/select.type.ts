// src\design-system\components\input\types\select.type.ts

import type { SelectRootProps } from "@chakra-ui/react";
import type { ComponentType, MouseEvent, ReactNode, RefObject } from "react";

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
  clearable?: boolean;
  handleClear?: (e: MouseEvent) => void;
};

export type SelectProps = Omit<
  SelectRootProps,
  "value" | "defaultValue" | "onValueChange" | "collection"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option?: SelectOption) => void;
  options?: SelectOption[];
  /** @deprecated use `options` instead */
  selectOptions?: SelectOption[];
  placeholder?: string;
  clearable?: boolean;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  suffixLabel?: ReactNode;
  trigger?: ReactNode | ((params: SelectTriggerRenderParams) => ReactNode);
  renderOption?: (option: SelectOption) => ReactNode;
};

