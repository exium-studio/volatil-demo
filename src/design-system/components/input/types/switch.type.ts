// src/design-system/components/input/types/switch.type.ts

import { Switch as ChakraSwitch } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SwitchProps = ChakraSwitch.RootProps & {
  children?: ReactNode;
  controlProps?: ChakraSwitch.ControlProps;
  thumbProps?: ChakraSwitch.ThumbProps;
};
