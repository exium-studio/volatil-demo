// src/design-system/components/feedback/ui/progress.tsx

import { Progress as ChakraProgress } from "@chakra-ui/react";
import { ProgressCircle as ChakraProgressCircle } from "@chakra-ui/react";
import type {
  ProgressRootProps,
  ProgressTrackProps,
  ProgressRangeProps,
  ProgressValueTextProps,
  ProgressCircleRootProps,
  ProgressCircleCircleProps,
  ProgressCircleTrackProps,
  ProgressCircleRangeProps,
  ProgressCircleValueTextProps,
  ProgressCircleLabelProps,
} from "@/design-system/components/feedback/types/progress.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export const ProgressRoot = (props: ProgressRootProps) => {
  // Stores
  const { theme } = useThemeStore();

  return <ChakraProgress.Root colorPalette={theme.colorPalette} {...props} />;
};

export const ProgressTrack = (props: ProgressTrackProps) => {
  return <ChakraProgress.Track {...props} />;
};

export const ProgressRange = (props: ProgressRangeProps) => {
  return <ChakraProgress.Range {...props} />;
};

export const ProgressValueText = (props: ProgressValueTextProps) => {
  return <ChakraProgress.ValueText {...props} />;
};

export const Progress = {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Range: ProgressRange,
  ValueText: ProgressValueText,
};

// -------------------------------------------------------------------------------------

export const ProgressCircleRoot = (props: ProgressCircleRootProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraProgressCircle.Root colorPalette={theme.colorPalette} {...props} />
  );
};

export const ProgressCircleCircle = (props: ProgressCircleCircleProps) => {
  return <ChakraProgressCircle.Circle {...props} />;
};

export const ProgressCircleTrack = (props: ProgressCircleTrackProps) => {
  return <ChakraProgressCircle.Track {...props} />;
};

export const ProgressCircleRange = (props: ProgressCircleRangeProps) => {
  return <ChakraProgressCircle.Range {...props} />;
};

export const ProgressCircleLabel = (props: ProgressCircleLabelProps) => {
  return <ChakraProgressCircle.Label {...props} />;
};

export const ProgressCircleValueText = (
  props: ProgressCircleValueTextProps,
) => {
  return <ChakraProgressCircle.ValueText {...props} />;
};

export const ProgressCircle = {
  Root: ProgressCircleRoot,
  Circle: ProgressCircleCircle,
  Track: ProgressCircleTrack,
  Range: ProgressCircleRange,
  Label: ProgressCircleLabel,
  ValueText: ProgressCircleValueText,
};
