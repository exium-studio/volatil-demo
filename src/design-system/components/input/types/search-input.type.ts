// src/design-system/components/input/types/search-input.type.ts

import type { InputProps } from "@/design-system/components/input/types/input.type";

export type SearchInputProps = {
  queryKey?: string;
  value?: string;
  onValueChange?: (value: string) => void;
} & InputProps;
