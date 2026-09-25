// src/design-system/components/input/types/pin-input.type.ts

import { PinInput as ChakraPinInput } from "@chakra-ui/react";

export type PinInputProps = ChakraPinInput.RootProps & {
  count?: number;
  attached?: boolean;
  mask?: boolean;
  placeholder?: string;
  fluid?: boolean;
  inputProps?: ChakraPinInput.InputProps;
};

