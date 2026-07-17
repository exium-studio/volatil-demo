// src/design-system/components/disclosure/ui/collapsible.tsx

"use client";

import type {
  CollapsibleContentProps,
  CollapsibleIndicatorProps,
  CollapsibleRootProps,
} from "@/design-system/components/disclosure/type/collabsible.type";
import {
  Collapsible as ChakraCollapsible,
  type CollapsibleTriggerProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

const CollapsibleRoot = (props: CollapsibleRootProps) => (
  <ChakraCollapsible.Root {...props} />
);

const CollapsibleContext = (props: {
  children: (context: any) => ReactNode;
}) => <ChakraCollapsible.Context {...props} />;

const CollapsibleTrigger = (props: CollapsibleTriggerProps) => (
  <ChakraCollapsible.Trigger {...props} />
);

const CollapsibleContent = (props: CollapsibleContentProps) => (
  <ChakraCollapsible.Content {...props} />
);

const CollapsibleIndicator = (props: CollapsibleIndicatorProps) => (
  <ChakraCollapsible.Indicator {...props} />
);

export const Collapsible = {
  Root: CollapsibleRoot,
  Context: CollapsibleContext,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
  Indicator: CollapsibleIndicator,
};
