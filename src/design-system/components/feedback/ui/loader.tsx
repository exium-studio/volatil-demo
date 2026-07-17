// src/design-system/components/feedback/ui/loader.tsx

import type { LoaderProps } from "@/design-system/components/feedback/types/loader.type";
import { Spinner } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ ...props }, ref) => {
    return <Spinner ref={ref} size="sm" {...props} />;
  },
);
