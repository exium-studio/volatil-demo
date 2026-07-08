// src/design-system/components/layout/ui/grid.tsx

import type {
  GridItemProps,
  GridProps,
} from "@/design-system/components/layout/types/grid.type";
import {
  Grid as ChakraGrid,
  GridItem as ChakraGridItem,
} from "@chakra-ui/react";

export const Grid = (props: GridProps) => {
  return <ChakraGrid {...props} />;
};

export const GridItem = (props: GridItemProps) => {
  return <ChakraGridItem {...props} />;
};
