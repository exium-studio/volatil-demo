// src/design-system/components/disclosure/ui/tabs.tsx

"use client";

import { forwardRef } from "react";
import { Tabs as ChakraTabs } from "@chakra-ui/react";
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsContentGroupProps,
  TabsIndicatorProps,
} from "@/design-system/components/disclosure/type/tabs.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();
  return (
    <ChakraTabs.Root ref={ref} colorPalette={theme.colorPalette} {...props} />
  );
});

const TabsList = forwardRef<HTMLDivElement, TabsListProps>((props, ref) => {
  return <ChakraTabs.List ref={ref} {...props} />;
});

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (props, ref) => {
    return <ChakraTabs.Trigger ref={ref} {...props} />;
  },
);

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  (props, ref) => {
    return <ChakraTabs.Content ref={ref} {...props} />;
  },
);

const TabsContentGroup = forwardRef<HTMLDivElement, TabsContentGroupProps>(
  (props, ref) => {
    return <ChakraTabs.ContentGroup ref={ref} {...props} />;
  },
);

const TabsIndicator = forwardRef<HTMLDivElement, TabsIndicatorProps>(
  (props, ref) => {
    return <ChakraTabs.Indicator ref={ref} {...props} />;
  },
);

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  ContentGroup: TabsContentGroup,
  Indicator: TabsIndicator,
};
