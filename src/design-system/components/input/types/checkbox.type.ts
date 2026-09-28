import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type CheckboxProps = ChakraCheckbox.RootProps & {
  children?: ReactNode;
  controlProps?: ChakraCheckbox.ControlProps;
};
