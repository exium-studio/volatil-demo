// src/design-system/components/icon/ui/icon.tsx

"use client";

import {
  Icon as ChakraIcon,
  type IconProps as ChakraIconProps,
} from "@chakra-ui/react";

type IconProps = ChakraIconProps;

export const Icon = (props: IconProps) => {
  // Props
  const { ...restProps } = props;

  return <ChakraIcon {...restProps} />;
};
