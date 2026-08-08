// src/design-system/components/feedback/ui/alert.tsx

import type {
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertRootProps,
  AlertTitleProps,
} from "@/design-system/components/feedback/types/alert.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Alert as ChakraAlert } from "@chakra-ui/react";

export const AlertRoot = (props: AlertRootProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraAlert.Root
      rounded={props.rounded ?? theme.radii.component}
      {...props}
    />
  );
};

export const AlertIndicator = (props: AlertIndicatorProps) => {
  return <ChakraAlert.Indicator mt={"2px"} {...props} />;
};

export const AlertTitle = (props: AlertTitleProps) => {
  return <ChakraAlert.Title {...props} />;
};

export const AlertDescription = (props: AlertDescriptionProps) => {
  return <ChakraAlert.Description {...props} />;
};

export const AlertContent = (props: AlertContentProps) => {
  return <ChakraAlert.Content {...props} />;
};

export const Alert = {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Title: AlertTitle,
  Description: AlertDescription,
  Content: AlertContent,
};
