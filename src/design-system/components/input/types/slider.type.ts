// src/design-system/components/input/types/slider.type.ts

import { Slider as ChakraSlider } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SliderProps = ChakraSlider.RootProps & {
  label?: ReactNode;
  showValue?: boolean;
  marks?: Array<number | { value: number; label: ReactNode }>;
};
