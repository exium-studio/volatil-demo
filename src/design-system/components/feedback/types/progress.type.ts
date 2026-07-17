// src/design-system/components/feedback/types/progress.type.ts

import { Progress as ChakraProgress } from "@chakra-ui/react";
import { ProgressCircle as ChakraProgressCircle } from "@chakra-ui/react";

export type ProgressRootProps = ChakraProgress.RootProps & {};

export type ProgressTrackProps = ChakraProgress.TrackProps & {};

export type ProgressRangeProps = ChakraProgress.RangeProps & {};

export type ProgressLabelProps = ChakraProgress.LabelProps & {};

export type ProgressValueTextProps = ChakraProgress.ValueTextProps & {};

// -----------------------------------------------------------------

export type ProgressCircleRootProps = ChakraProgressCircle.RootProps & {};

export type ProgressCircleCircleProps = ChakraProgressCircle.CircleProps & {};

export type ProgressCircleTrackProps = ChakraProgressCircle.TrackProps & {};

export type ProgressCircleRangeProps = ChakraProgressCircle.RangeProps & {};

export type ProgressCircleLabelProps = ChakraProgressCircle.LabelProps & {};

export type ProgressCircleValueTextProps =
  ChakraProgressCircle.ValueTextProps & {};
