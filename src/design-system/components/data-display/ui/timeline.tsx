// src\design-system\components\data-display\ui\timeline.tsx

"use client";

import { forwardRef } from "react";
import { Timeline as ChakraTimeline } from "@chakra-ui/react";
import type {
  TimelineRootProps,
  TimelineItemProps,
  TimelineConnectorProps,
  TimelineSeparatorProps,
  TimelineIndicatorProps,
  TimelineContentProps,
  TimelineTitleProps,
  TimelineDescriptionProps,
} from "@/design-system/components/data-display/types/timeline.type";
import { useThemeStore } from "@/design-system/stores/theme-store";

const TimelineRoot = forwardRef<HTMLDivElement, TimelineRootProps>(
  (props, ref) => {
    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraTimeline.Root
        ref={ref}
        colorPalette={theme.colorPalette}
        {...props}
      />
    );
  },
);
TimelineRoot.displayName = "TimelineRoot";

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (props, ref) => {
    return <ChakraTimeline.Item ref={ref} {...props} />;
  },
);
TimelineItem.displayName = "TimelineItem";

const TimelineConnector = forwardRef<HTMLDivElement, TimelineConnectorProps>(
  (props, ref) => {
    return <ChakraTimeline.Connector ref={ref} {...props} />;
  },
);
TimelineConnector.displayName = "TimelineConnector";

const TimelineSeparator = forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  (props, ref) => {
    return <ChakraTimeline.Separator ref={ref} {...props} />;
  },
);
TimelineSeparator.displayName = "TimelineSeparator";

const TimelineIndicator = forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  (props, ref) => {
    return <ChakraTimeline.Indicator ref={ref} {...props} />;
  },
);
TimelineIndicator.displayName = "TimelineIndicator";

const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  (props, ref) => {
    return <ChakraTimeline.Content ref={ref} {...props} />;
  },
);
TimelineContent.displayName = "TimelineContent";

const TimelineTitle = forwardRef<HTMLDivElement, TimelineTitleProps>(
  (props, ref) => {
    return <ChakraTimeline.Title ref={ref} {...props} />;
  },
);
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = forwardRef<
  HTMLDivElement,
  TimelineDescriptionProps
>((props, ref) => {
  return <ChakraTimeline.Description ref={ref} {...props} />;
});
TimelineDescription.displayName = "TimelineDescription";

export const Timeline = {
  Root: TimelineRoot,
  Item: TimelineItem,
  Connector: TimelineConnector,
  Separator: TimelineSeparator,
  Indicator: TimelineIndicator,
  Content: TimelineContent,
  Title: TimelineTitle,
  Description: TimelineDescription,
};
