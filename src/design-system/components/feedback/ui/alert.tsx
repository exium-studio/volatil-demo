// src/design-system/components/feedback/ui/alert.tsx

import type {
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertRootProps,
  AlertTitleProps,
} from "@/design-system/components/feedback/types/alert.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Alert as ChakraAlert } from "@chakra-ui/react";

export const AlertRoot = (props: AlertRootProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraAlert.Root
      colorPalette={"neutral"}
      rounded={props.rounded ?? theme.radii.component}
      {...props}
    />
  );
};

export const AlertIndicator = (props: AlertIndicatorProps) => {
  return <ChakraAlert.Indicator boxSize={5} {...props} />;
};

export const AlertTitle = (props: AlertTitleProps) => {
  return <ChakraAlert.Title lineHeight={1.2} {...props} />;
};

export const AlertDescription = (props: AlertDescriptionProps) => {
  return <ChakraAlert.Description fontSize={"sm"} {...props} />;
};

export const AlertContent = (props: AlertContentProps) => {
  return <ChakraAlert.Content gap={"xs"} {...props} />;
};

export const Alert = {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Title: AlertTitle,
  Description: AlertDescription,
  Content: AlertContent,
};
