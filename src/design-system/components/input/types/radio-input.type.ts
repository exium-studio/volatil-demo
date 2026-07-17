// src/design-system/components/input/types/radio-input.type.ts

import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type RadioInputOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type RadioInputProps = ChakraRadioGroup.RootProps & {
  options: RadioInputOption[];
  itemProps?: ChakraRadioGroup.ItemProps;
  itemControlProps?: ChakraRadioGroup.ItemControlProps;
};
