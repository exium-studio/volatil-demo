// src/design-system/components/typography/ui/heading.tsx

import type { HeadingProps } from "@/design-system/components/typography/types/heading.type";
import { Heading as ChakraHeading } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    return (
      <ChakraHeading
        ref={ref}
        fontSize={"lg"}
        fontWeight={"semibold"}
        {...props}
      />
    );
  },
);
