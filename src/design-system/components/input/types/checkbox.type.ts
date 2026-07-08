// src/design-system/components/input/types/checkbox.type.ts

import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";

export type CheckboxProps = ChakraCheckbox.RootProps & {
  children?: React.ReactNode;
  controlProps?: ChakraCheckbox.ControlProps;
}
