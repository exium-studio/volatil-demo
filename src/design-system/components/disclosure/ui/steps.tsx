// src/design-system/components/disclosure/ui/steps.tsx

"use client";

import { forwardRef } from "react";
import { Steps as ChakraSteps } from "@chakra-ui/react";
import type {
  StepsRootProps,
  StepsListProps,
  StepsItemProps,
  StepsTriggerProps,
  StepsIndicatorProps,
  StepsSeparatorProps,
  StepsContentProps,
  StepsCompletedContentProps,
  StepsNextTriggerProps,
  StepsPrevTriggerProps,
  StepsTitleProps,
  StepsDescriptionProps,
  StepsNumberProps,
  StepsStatusProps,
} from "@/design-system/components/disclosure/type/steps.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

const StepsRoot = forwardRef<HTMLDivElement, StepsRootProps>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraSteps.Root ref={ref} colorPalette={theme.colorPalette} {...props} />
  );
});

const StepsList = forwardRef<HTMLDivElement, StepsListProps>((props, ref) => {
  return <ChakraSteps.List ref={ref} {...props} />;
});

const StepsItem = forwardRef<HTMLDivElement, StepsItemProps>((props, ref) => {
  return <ChakraSteps.Item ref={ref} {...props} />;
});

const StepsTrigger = forwardRef<HTMLButtonElement, StepsTriggerProps>(
  (props, ref) => {
    return <ChakraSteps.Trigger ref={ref} {...props} />;
  },
);

const StepsIndicator = forwardRef<HTMLDivElement, StepsIndicatorProps>(
  (props, ref) => {
    return <ChakraSteps.Indicator ref={ref} {...props} />;
  },
);

const StepsSeparator = forwardRef<HTMLDivElement, StepsSeparatorProps>(
  (props, ref) => {
    return <ChakraSteps.Separator ref={ref} {...props} />;
  },
);

const StepsContent = forwardRef<HTMLDivElement, StepsContentProps>(
  (props, ref) => {
    return <ChakraSteps.Content ref={ref} {...props} />;
  },
);

const StepsCompletedContent = forwardRef<
  HTMLDivElement,
  StepsCompletedContentProps
>((props, ref) => {
  return <ChakraSteps.CompletedContent ref={ref} {...props} />;
});

const StepsNextTrigger = forwardRef<HTMLButtonElement, StepsNextTriggerProps>(
  (props, ref) => {
    return <ChakraSteps.NextTrigger ref={ref} {...props} />;
  },
);

const StepsPrevTrigger = forwardRef<HTMLButtonElement, StepsPrevTriggerProps>(
  (props, ref) => {
    return <ChakraSteps.PrevTrigger ref={ref} {...props} />;
  },
);

const StepsTitle = forwardRef<HTMLDivElement, StepsTitleProps>((props, ref) => {
  return <ChakraSteps.Title ref={ref} {...props} />;
});

const StepsDescription = forwardRef<HTMLDivElement, StepsDescriptionProps>(
  (props, ref) => {
    return <ChakraSteps.Description ref={ref} {...props} />;
  },
);

const StepsNumber = forwardRef<HTMLDivElement, StepsNumberProps>(
  (props, ref) => {
    return <ChakraSteps.Number ref={ref} {...props} />;
  },
);

const StepsStatus = (props: StepsStatusProps) => {
  return <ChakraSteps.Status {...props} />;
};

export const Steps = {
  Root: StepsRoot,
  List: StepsList,
  Item: StepsItem,
  Trigger: StepsTrigger,
  Indicator: StepsIndicator,
  Separator: StepsSeparator,
  Content: StepsContent,
  CompletedContent: StepsCompletedContent,
  NextTrigger: StepsNextTrigger,
  PrevTrigger: StepsPrevTrigger,
  Title: StepsTitle,
  Description: StepsDescription,
  Number: StepsNumber,
  Status: StepsStatus,
};
