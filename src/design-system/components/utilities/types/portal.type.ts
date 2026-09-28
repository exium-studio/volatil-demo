// src/design-system/components/utilities/types/portal.type.ts

import type { PortalProps as ChakraPortalProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type PortalProps = ChakraPortalProps & { children?: ReactNode };
