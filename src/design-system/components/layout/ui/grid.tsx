// src/design-system/components/layout/ui/grid.tsx

import type {
  GridItemProps,
  GridProps,
  SimpleGridProps,
} from "@/design-system/components/layout/types/grid.type";
import {
  Grid as ChakraGrid,
  GridItem as ChakraGridItem,
  SimpleGrid as ChakraSimpleGrid,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <ChakraGrid ref={ref} {...props} />;
});

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (props, ref) => {
    return <ChakraGridItem ref={ref} {...props} />;
  },
);

export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>(
  (props, ref) => {
    return <ChakraSimpleGrid ref={ref} {...props} />;
  },
);
