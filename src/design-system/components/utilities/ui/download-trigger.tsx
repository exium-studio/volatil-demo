// src/design-system/components/utilities/ui/download-trigger.tsx

"use client";

import { DownloadTrigger as ChakraDownloadTrigger } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { DownloadTriggerProps } from "../types/download-trigger.type";

export const DownloadTrigger = forwardRef<HTMLButtonElement, DownloadTriggerProps>(
  (props, ref) => {
    return <ChakraDownloadTrigger ref={ref} asChild {...props} />;
  },
);
