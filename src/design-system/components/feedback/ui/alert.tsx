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

const STATUS_COLOR_PALETTE_MAP: Record<string, string> = {
  info: "blue",
  warning: "orange",
  error: "red",
  success: "green",
  neutral: "neutral",
};

export const AlertRoot = (props: AlertRootProps) => {
  // Stores
  const { theme } = useThemeStore();

  const { status, colorPalette, variant = "subtle", ...restProps } = props;

  const resolvedColorPalette =
    colorPalette ??
    (typeof status === "string"
      ? STATUS_COLOR_PALETTE_MAP[status]
      : undefined) ??
    "neutral";

  return (
    <ChakraAlert.Root
      status={status}
      colorPalette={resolvedColorPalette}
      variant={variant}
      rounded={props.rounded ?? theme.radii.component}
      {...restProps}
    />
  );
};

export const AlertIndicator = (props: AlertIndicatorProps) => {
  return <ChakraAlert.Indicator boxSize={5} {...props} />;
};

export const AlertTitle = (props: AlertTitleProps) => {
  return <ChakraAlert.Title lineHeight={"1.5em"} {...props} />;
};

export const AlertDescription = (props: AlertDescriptionProps) => {
  return (
    <ChakraAlert.Description fontSize={"sm"} lineHeight={"1.5em"} {...props} />
  );
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
