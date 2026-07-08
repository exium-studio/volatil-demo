// src/design-system/components/typography/ui/kbd.tsx

import {
  Kbd as ChakraKbd,
  type KbdProps as ChakraKbdProps,
} from "@chakra-ui/react";

export const Kbd = (props: ChakraKbdProps) => {
  return <ChakraKbd fontSize={"2xs"} {...props} />;
};
