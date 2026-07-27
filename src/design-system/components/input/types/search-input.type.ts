// src/design-system/components/input/types/search-input.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { InputGroupProps } from "@/design-system/components/input/types/input-group.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";

export type SearchInputProps = InputProps & {
  queryKey?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  inputGroupProps?: Omit<InputGroupProps, "children">;
  appIconProps?: AppIconProps;
};
