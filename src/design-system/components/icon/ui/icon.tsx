// src/design-system/components/icon/ui/icon.tsx

"use client";

import type { IconProps } from "@/design-system/components/icon/types/icon.type";
import { Icon as ChakraIcon } from "@chakra-ui/react";

export const Icon = (props: IconProps) => {
  // Props
  const { ...restProps } = props;

  return <ChakraIcon {...restProps} />;
};
