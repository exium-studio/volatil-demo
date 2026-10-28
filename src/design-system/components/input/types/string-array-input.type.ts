// src/design-system/components/input/types/string-array-input.type.ts

export type StringArrayInputProps = {
  value?: string[];
  onChange?: (nextValue: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  emptyText?: string;
  itemPrefix?: string;
  maxItems?: number;
};
