// src/design-system/components/input/types/field.type.ts

import { Field as ChakraField } from "@chakra-ui/react";

export type FieldProps = Omit<ChakraField.RootProps, "label"> & {
  label?: React.ReactNode;
  labelProps?: ChakraField.LabelProps;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  optional?: boolean;
};
