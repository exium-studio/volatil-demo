// src/design-system/components/typography/types/p.type.ts

import type { SpanProps, TextProps } from "@chakra-ui/react";

export type PProps = TextProps & {
  href?: string;
  target?: string;
  rel?: string;
};

export type TNumProps = {
  numberFont?: boolean;
} & SpanProps;
