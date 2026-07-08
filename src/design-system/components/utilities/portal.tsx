// src/design-system/components/utilities/portal.tsx

import { type ReactNode } from "react";
import { Portal as ChakraPortal } from "@chakra-ui/react";
import type { PortalProps as ChakraPortalProps } from "@chakra-ui/react";

export type PortalProps = ChakraPortalProps & { children?: ReactNode };

export const Portal = ({ children, ...props }: PortalProps) => {
  return <ChakraPortal {...props}>{children}</ChakraPortal>;
};
