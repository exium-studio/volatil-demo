// src/design-system/components/disclosure/ui/collapsible.tsx

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

const CollapsibleRoot = (props: CollapsibleRootProps) => {
  // Props
  const { opened, ...restProps } = props;

  return <ChakraCollapsible.Root open={opened} {...restProps} />;
};

const CollapsibleContext = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (context: any) => ReactNode;
}) => <ChakraCollapsible.Context {...props} />;

const CollapsibleTrigger = (props: CollapsibleTriggerProps) => (
  <ChakraCollapsible.Trigger asChild {...props} />
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
