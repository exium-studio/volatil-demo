// src/design-system/components/utilities/ui/portal.tsx

import type { PortalProps } from "@/design-system/components/utilities/types/portal.type";
import { Portal as ChakraPortal } from "@chakra-ui/react";

export const Portal = ({ children, ...props }: PortalProps) => {
  return <ChakraPortal {...props}>{children}</ChakraPortal>;
};
