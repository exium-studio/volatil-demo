// src/design-system/components/typography/ui/heading.tsx

import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
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
        lineHeight={1}
        {...props}
      />
    );
  },
);

export const ClampedHeading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    // Props
    const { children, ...restProps } = props;

    return (
      <Tooltip content={children}>
        <ChakraHeading
          ref={ref}
          fontSize={"lg"}
          fontWeight={"semibold"}
          lineHeight={1}
          lineClamp={1}
          {...restProps}
        >
          {children}
        </ChakraHeading>
      </Tooltip>
    );
  },
);
