// src/design-system/components/disclosure/types/presence.type.ts

import type { PresenceProps as ChakraPresenceProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type PresenceProps = ChakraPresenceProps & {
  children?: ReactNode;
};
