// src/design-system/components/typography/ui/list.tsx

import { List as ChakraList } from "@chakra-ui/react";
import { forwardRef } from "react";
import type {
  ListIndicatorProps,
  ListItemProps,
  ListRootProps,
} from "@/design-system/components/typography/types/list.type";

export const ListRoot = forwardRef<HTMLUListElement, ListRootProps>(
  (props, ref) => {
    return <ChakraList.Root ref={ref} {...props} />;
  },
);

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (props, ref) => {
    return <ChakraList.Item ref={ref} {...props} />;
  },
);

export const ListIndicator = forwardRef<HTMLSpanElement, ListIndicatorProps>(
  (props, ref) => {
    return <ChakraList.Indicator ref={ref} {...props} />;
  },
);

export const List = {
  Root: ListRoot,
  Item: ListItem,
  Indicator: ListIndicator,
};
