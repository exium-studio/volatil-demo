// src/design-system/components/typography/types/p.type.ts

import type { SpanProps, TextProps } from "@chakra-ui/react";

export type PProps = TextProps;

export type TNumProps = {
  numberFont?: boolean;
} & SpanProps;
