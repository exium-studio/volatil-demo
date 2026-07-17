// src/design-system/components/disclosure/ui/accordion.tsx

"use client";

import { forwardRef } from "react";
import { Accordion as ChakraAccordion } from "@chakra-ui/react";
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionItemContentProps,
  AccordionItemBodyProps,
  AccordionItemIndicatorProps,
} from "@/design-system/components/disclosure/type/accordion.type";

const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  (props, ref) => {
    return <ChakraAccordion.Root ref={ref} {...props} />;
  },
);

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, ref) => {
    return <ChakraAccordion.Item ref={ref} {...props} />;
  },
);

const AccordionItemTrigger = forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>((props, ref) => {
  return <ChakraAccordion.ItemTrigger ref={ref} {...props} />;
});

const AccordionItemContent = forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>((props, ref) => {
  return <ChakraAccordion.ItemContent ref={ref} {...props} />;
});

const AccordionItemBody = forwardRef<HTMLDivElement, AccordionItemBodyProps>(
  (props, ref) => {
    return <ChakraAccordion.ItemBody ref={ref} {...props} />;
  },
);

const AccordionItemIndicator = forwardRef<
  HTMLDivElement,
  AccordionItemIndicatorProps
>((props, ref) => {
  return <ChakraAccordion.ItemIndicator ref={ref} {...props} />;
});

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  ItemTrigger: AccordionItemTrigger,
  ItemContent: AccordionItemContent,
  ItemBody: AccordionItemBody,
  ItemIndicator: AccordionItemIndicator,
};
