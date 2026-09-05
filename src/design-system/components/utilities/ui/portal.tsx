// src/design-system/components/utilities/ui/portal.tsx

import type { PortalProps } from "@/design-system/components/utilities/types/portal.type";
import { Portal as ChakraPortal } from "@chakra-ui/react";

export const Portal = (props: PortalProps) => {
  // Props
  const { children, ...restProps } = props;

  return <ChakraPortal {...restProps}>{children}</ChakraPortal>;
};
