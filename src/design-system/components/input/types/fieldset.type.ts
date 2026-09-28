import { Fieldset as ChakraFieldset } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type FieldsetProps = ChakraFieldset.RootProps & {
  legend?: ReactNode;
  containeredContent?: boolean;
};
