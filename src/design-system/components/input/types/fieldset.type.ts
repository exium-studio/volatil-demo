// src/design-system/components/input/types/fieldset.type.ts

import { Fieldset as ChakraFieldset } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type FieldsetProps = ChakraFieldset.RootProps & {
  legend?: ReactNode;
};
