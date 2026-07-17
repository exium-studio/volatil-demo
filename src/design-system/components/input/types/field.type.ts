// src/design-system/components/input/types/field.type.ts

import { Field as ChakraField } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type FieldProps = Omit<ChakraField.RootProps, "label"> & {
  label?: ReactNode;
  labelProps?: ChakraField.LabelProps;
  helperText?: ReactNode;
  errorText?: ReactNode;
  optionalText?: ReactNode;
  optional?: boolean;
};
