import type { FieldVariant } from "@/design-system/components/input/types/field.type";
import type { Field as ChakraField } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type FieldContextValue = {
  variant?: FieldVariant;
  isFloating?: boolean;
  hasValue?: boolean;
  label?: ReactNode;
  optional?: boolean;
  labelProps?: ChakraField.LabelProps;
};
