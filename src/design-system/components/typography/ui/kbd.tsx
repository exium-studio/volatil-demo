// src/design-system/components/typography/ui/kbd.tsx

import { Kbd as ChakraKbd } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { KbdProps } from "@/design-system/components/typography/types/kbd.type";

export const Kbd = forwardRef<HTMLElement, KbdProps>((props, ref) => {
  return <ChakraKbd ref={ref} fontSize={"2xs"} bg={"bg.muted"} {...props} />;
});
