// src/design-system/components/disclosure/type/collabsible.type.ts

import { Collapsible as ChakraCollapsible } from "@chakra-ui/react";

export type CollapsibleRootProps = Omit<ChakraCollapsible.RootProps, "open"> & {
  opened?: boolean;
};

export type CollapsibleTriggerProps = ChakraCollapsible.TriggerProps & {};

export type CollapsibleContentProps = ChakraCollapsible.ContentProps & {};

export type CollapsibleIndicatorProps = ChakraCollapsible.IndicatorProps & {};
